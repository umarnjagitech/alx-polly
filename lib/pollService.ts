import { createSupabaseServer } from "@/lib/supabase/server";
import { CreatePollInput, UpdatePollInput } from "@/lib/types/polls";

/**
 * Create a new poll and its options using the Supabase RPC function.
 *
 * Expects the `create_poll_with_options` RPC to exist in the database.
 * See `supabase/migrations/0001_create_polls.sql` for schema.
 */

export async function createPollWithOptions(input: CreatePollInput): Promise<void> {
  const supabase = await createSupabaseServer();
  const { error } = await supabase.rpc("create_poll_with_options", {
    p_question: input.question,
    p_options: input.options,
  });
  if (error) {
    throw new Error(error.message);
  }
}

/**
 * Update an existing poll's question and replace all options.
 *
 * This function performs 3 operations:
 * 1) Update `polls.question`
 * 2) Delete all existing `poll_options` for the poll
 * 3) Insert the provided options in order
 */
export async function updatePoll(input: UpdatePollInput, userId: string): Promise<void> {
  const supabase = await createSupabaseServer();

  const { data: poll, error: selectErr } = await supabase
    .from('polls')
    .select('id')
    .eq('id', input.pollId)
    .eq('created_by', userId)
    .single();

  if (selectErr || !poll) {
    throw new Error('Poll not found or you do not have permission to update it.');
  }

  const { error: upErr } = await supabase
    .from("polls")
    .update({ question: input.question })
    .eq("id", input.pollId);
  if (upErr) {
    throw new Error(upErr.message);
  }

  const { error: delErr } = await supabase
    .from("poll_options")
    .delete()
    .eq("poll_id", input.pollId);
  if (delErr) {
    throw new Error(delErr.message);
  }

  const rows = input.options.map((opt, idx) => ({ poll_id: input.pollId, option_text: opt, position: idx + 1 }));
  const { error: insErr } = await supabase.from("poll_options").insert(rows);
  if (insErr) {
    throw new Error(insErr.message);
  }
}

/**
 * Delete a poll by id. Cascades are expected to be handled by DB constraints.
 */
export async function deletePoll(pollId: string, userId: string): Promise<void> {
  const supabase = await createSupabaseServer();

  const { data: poll, error: selectErr } = await supabase
    .from('polls')
    .select('id')
    .eq('id', pollId)
    .eq('created_by', userId)
    .single();

  if (selectErr || !poll) {
    throw new Error('Poll not found or you do not have permission to delete it.');
  }

  const { error } = await supabase.from("polls").delete().eq("id", pollId);
  if (error) {
    throw new Error(error.message);
  }
}