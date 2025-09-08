/**
 * Unit tests for poll server actions.
 *
 * Tests createPollAction, deletePollAction, and updatePollAction.
 * Mocks dependencies and verifies proper validation and error handling.
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('@/lib/auth/server', () => ({
  requireUserId: vi.fn(async () => 'user-1'),
}));

vi.mock('@/lib/pollService', () => ({
  createPollWithOptions: vi.fn(async () => {}),
  deletePoll: vi.fn(async () => {}),
  updatePoll: vi.fn(async () => {}),
}));

const upsert = vi.fn(() => ({ error: null }));
const from = vi.fn(() => ({ upsert }));
const getUser = vi.fn(() => ({ data: { user: { id: 'user-1' } }, error: null }));
const supabase = { auth: { getUser }, from };
vi.mock('@/lib/supabase/server', () => ({
    createSupabaseServer: vi.fn(() => supabase),
}));

vi.mock('next/navigation', () => ({
  redirect: vi.fn((url: string) => {
    const err: any = new Error('NEXT_REDIRECT');
    err.digest = `NEXT_REDIRECT;${url}`;
    throw err;
  }),
}));

vi.mock('next/cache', () => ({
  revalidatePath: vi.fn(),
}));

vi.mock('next/dist/client/components/redirect', () => ({
  isRedirectError: (err: any) => err?.digest?.startsWith('NEXT_REDIRECT'),
}));

import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { createPollAction, deletePollAction, updatePollAction, voteAction } from '@/app/polls/actions';
import { requireUserId } from '@/lib/auth/server';
import { createPollWithOptions, deletePoll, updatePoll } from '@/lib/pollService';

const makeFormData = (entries: Record<string, string>) => {
  const fd = new FormData();
  for (const [k, v] of Object.entries(entries)) fd.append(k, v);
  return fd;
};

describe('poll actions', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('createPollAction validates inputs', async () => {
    const res1 = await createPollAction(makeFormData({ question: '', options: 'A\nB' }));
    expect(res1 && typeof res1 === 'object' && 'ok' in res1 && res1.ok === false).toBe(true);
    const res2 = await createPollAction(makeFormData({ question: 'Q', options: 'OnlyOne' }));
    expect(res2 && typeof res2 === 'object' && 'ok' in res2 && res2.ok === false).toBe(true);
  });

  it('createPollAction calls supabase rpc and redirects on success', async () => {
    (createPollWithOptions as unknown as vi.Mock).mockResolvedValue(undefined);

    await expect(createPollAction(makeFormData({ question: 'Q', options: 'A\nB' }))).rejects.toMatchObject({ digest: 'NEXT_REDIRECT;/polls?created=1' });

    expect(requireUserId).toHaveBeenCalled();
    expect(createPollWithOptions).toHaveBeenCalledWith({ question: 'Q', options: ['A', 'B'] });
    expect(revalidatePath).toHaveBeenCalledWith('/polls');
    expect(redirect).toHaveBeenCalledWith('/polls?created=1');
  });

  it('deletePollAction deletes and redirects', async () => {
    (deletePoll as unknown as vi.Mock).mockResolvedValue(undefined);

    await expect(deletePollAction(makeFormData({ poll_id: '123' }))).rejects.toMatchObject({ digest: 'NEXT_REDIRECT;/polls' });

    expect(requireUserId).toHaveBeenCalled();
    expect(deletePoll).toHaveBeenCalledWith('123', 'user-1');
    expect(revalidatePath).toHaveBeenCalledWith('/polls');
    expect(redirect).toHaveBeenCalledWith('/polls');
  });

  it('updatePollAction updates question, replaces options, and redirects', async () => {
    (updatePoll as unknown as vi.Mock).mockResolvedValue(undefined);

    const fd = makeFormData({ poll_id: '42', question: 'New Q', options: 'A\nB\nC' });
    await expect(updatePollAction(fd)).rejects.toMatchObject({ digest: 'NEXT_REDIRECT;/polls/42?updated=1' });

    expect(requireUserId).toHaveBeenCalled();
    expect(updatePoll).toHaveBeenCalledWith({ pollId: '42', question: 'New Q', options: ['A', 'B', 'C'] }, 'user-1');
    expect(revalidatePath).toHaveBeenCalledWith('/polls/42');
    expect(revalidatePath).toHaveBeenCalledWith('/polls');
    expect(redirect).toHaveBeenCalledWith('/polls/42?updated=1');
  });

  it('deletePollAction returns error result on missing poll id', async () => {
    const res = await deletePollAction(makeFormData({}));
    expect(res && typeof res === 'object' && 'ok' in res && res.ok === false).toBe(true);
  });

  describe('voteAction', () => {
    it('redirects if no option is selected', async () => {
        const fd = makeFormData({ poll_id: 'poll-123' });
        await expect(voteAction(fd)).rejects.toMatchObject({ digest: 'NEXT_REDIRECT;/polls/poll-123?error=no_option' });
        expect(redirect).toHaveBeenCalledWith('/polls/poll-123?error=no_option');
    });

    it('redirects if user is not authenticated', async () => {
        getUser.mockResolvedValueOnce({ data: { user: null }, error: null });
        const fd = makeFormData({ poll_id: 'poll-123', option: 'opt-1' });
        await expect(voteAction(fd)).rejects.toMatchObject({ digest: 'NEXT_REDIRECT;/polls/poll-123?error=unauthenticated' });
        expect(redirect).toHaveBeenCalledWith('/polls/poll-123?error=unauthenticated');
    });

    it('successfully submits a vote', async () => {
        const fd = makeFormData({ poll_id: 'poll-123', option: 'opt-1' });
        await voteAction(fd);
        expect(upsert).toHaveBeenCalledWith({ poll_id: 'poll-123', option_id: 'opt-1', voter_id: 'user-1' }, { onConflict: 'poll_id,voter_id' });
        expect(revalidatePath).toHaveBeenCalledWith('/polls/poll-123');
    });
  });
});