-- Enable required extensions (safe to run; no-op if already enabled)
create extension if not exists pgcrypto;

-- Tables
create table if not exists public.polls (
	id uuid primary key default gen_random_uuid(),
	question text not null check (length(trim(question)) > 0),
	created_by uuid references auth.users(id) on delete set null,
	created_at timestamptz not null default now()
);

create table if not exists public.poll_options (
	id uuid primary key default gen_random_uuid(),
	poll_id uuid not null references public.polls(id) on delete cascade,
	option_text text not null check (length(trim(option_text)) > 0),
	position integer not null,
	created_at timestamptz not null default now(),
	unique (poll_id, position),
	unique (poll_id, option_text)
);

-- Composite key to support validating option belongs to poll in votes
create unique index if not exists poll_options_id_poll_id_uidx on public.poll_options (id, poll_id);

create table if not exists public.poll_votes (
	id uuid primary key default gen_random_uuid(),
	poll_id uuid not null references public.polls(id) on delete cascade,
	option_id uuid not null references public.poll_options(id) on delete cascade,
	voter_id uuid not null references auth.users(id) on delete cascade,
	created_at timestamptz not null default now(),
	unique (poll_id, voter_id),
	-- Ensure the chosen option belongs to the same poll as the vote
	constraint poll_votes_option_belongs_to_poll
		foreign key (option_id, poll_id)
		references public.poll_options (id, poll_id)
		on delete cascade
);

-- Helpful views
create or replace view public.poll_vote_counts as
select
	po.poll_id,
	po.id as option_id,
	po.option_text,
	coalesce(v.count_votes, 0)::bigint as votes
from public.poll_options po
left join (
	select option_id, count(*)::bigint as count_votes
	from public.poll_votes
	group by option_id
) v on v.option_id = po.id;

-- RLS
alter table public.polls enable row level security;
alter table public.poll_options enable row level security;
alter table public.poll_votes enable row level security;

-- Policies: polls
drop policy if exists polls_select_all on public.polls;
create policy polls_select_all on public.polls
	for select using (true);

drop policy if exists polls_insert_owner on public.polls;
create policy polls_insert_owner on public.polls
	for insert with check (auth.role() = 'authenticated' and created_by = auth.uid());

drop policy if exists polls_update_owner on public.polls;
create policy polls_update_owner on public.polls
	for update using (created_by = auth.uid());

drop policy if exists polls_delete_owner on public.polls;
create policy polls_delete_owner on public.polls
	for delete using (created_by = auth.uid());

-- Policies: poll_options
drop policy if exists poll_options_select_all on public.poll_options;
create policy poll_options_select_all on public.poll_options
	for select using (true);

drop policy if exists poll_options_modify_owner on public.poll_options;
create policy poll_options_modify_owner on public.poll_options
	for all using (
		exists (
			select 1 from public.polls p
			where p.id = poll_options.poll_id and p.created_by = auth.uid()
		)
	) with check (
		exists (
			select 1 from public.polls p
			where p.id = poll_options.poll_id and p.created_by = auth.uid()
		)
	);

-- Policies: poll_votes
drop policy if exists poll_votes_select_all on public.poll_votes;
create policy poll_votes_select_all on public.poll_votes
	for select using (true);

drop policy if exists poll_votes_insert_self on public.poll_votes;
create policy poll_votes_insert_self on public.poll_votes
	for insert with check (
		auth.role() = 'authenticated' and voter_id = auth.uid()
	);

drop policy if exists poll_votes_update_self on public.poll_votes;
create policy poll_votes_update_self on public.poll_votes
	for update using (voter_id = auth.uid()) with check (voter_id = auth.uid());

drop policy if exists poll_votes_delete_self on public.poll_votes;
create policy poll_votes_delete_self on public.poll_votes
	for delete using (voter_id = auth.uid());

-- Helpful function to create a poll with options atomically
create or replace function public.create_poll_with_options(
	p_question text,
	p_options text[]
) returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
	new_poll_id uuid;
	idx integer := 1;
	opt text;
begin
	insert into public.polls (question, created_by)
	values (trim(p_question), auth.uid())
	returning id into new_poll_id;

	foreach opt in array p_options loop
		if trim(opt) <> '' then
			insert into public.poll_options (poll_id, option_text, position)
			values (new_poll_id, trim(opt), idx);
			idx := idx + 1;
		end if;
	end loop;

	return new_poll_id;
end;
$$;

-- Grant minimal privileges to anon for read-only access if needed
grant usage on schema public to anon, authenticated;
grant select on public.polls to anon, authenticated;
grant select on public.poll_options to anon, authenticated;
grant select on public.poll_votes to anon, authenticated;
grant select on public.poll_vote_counts to anon, authenticated;
