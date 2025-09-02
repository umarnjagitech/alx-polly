import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('@/lib/supabase/server', () => ({
  createSupabaseServer: vi.fn(),
}));

vi.mock('next/navigation', () => ({
  redirect: vi.fn(() => {
    const err: any = new Error('NEXT_REDIRECT');
    err.digest = 'NEXT_REDIRECT';
    throw err;
  }),
}));

vi.mock('next/cache', () => ({
  revalidatePath: vi.fn(),
}));

vi.mock('next/dist/client/components/redirect', () => ({
  isRedirectError: (err: any) => err?.digest === 'NEXT_REDIRECT',
}));

import { createSupabaseServer } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { createPollAction, deletePollAction, updatePollAction } from '@/app/polls/actions';

const mockSupabase = () => {
  const deleteEq = vi.fn(() => ({ error: null }));
  const updateEq = vi.fn(() => ({ error: null }));
  const from = (table: string) => ({
    delete: () => ({ eq: (_c: string, _v: any) => deleteEq() }),
    update: (_data: any) => ({ eq: (_c: string, _v: any) => updateEq() }),
    insert: (_rows: any[]) => ({ error: null }),
  });
  const rpc = vi.fn();

  (createSupabaseServer as unknown as vi.Mock).mockResolvedValue({ from, rpc });

  return { deleteEq, updateEq, rpc };
};

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
    mockSupabase();
    await expect(createPollAction(makeFormData({ question: '', options: 'A\nB' }))).rejects.toThrow();
    await expect(createPollAction(makeFormData({ question: 'Q', options: 'OnlyOne' }))).rejects.toThrow();
  });

  it('createPollAction calls supabase rpc and redirects on success', async () => {
    const { rpc } = mockSupabase();
    (rpc as vi.Mock).mockResolvedValue({ data: { id: '1' }, error: null });

    await expect(createPollAction(makeFormData({ question: 'Q', options: 'A\nB' }))).rejects.toMatchObject({ digest: 'NEXT_REDIRECT' });

    expect(rpc).toHaveBeenCalledWith('create_poll_with_options', {
      p_question: 'Q',
      p_options: ['A', 'B'],
    });
    expect(revalidatePath).toHaveBeenCalledWith('/polls');
    expect(redirect).toHaveBeenCalledWith('/polls?created=1');
  });

  it('deletePollAction deletes and redirects', async () => {
    const { deleteEq } = mockSupabase();

    await expect(deletePollAction(makeFormData({ poll_id: '123' }))).rejects.toMatchObject({ digest: 'NEXT_REDIRECT' });

    expect(deleteEq).toHaveBeenCalled();
    expect(revalidatePath).toHaveBeenCalledWith('/polls');
    expect(redirect).toHaveBeenCalledWith('/polls');
  });

  it('updatePollAction updates question, replaces options, and redirects', async () => {
    const { updateEq } = mockSupabase();

    const fd = makeFormData({ poll_id: '42', question: 'New Q', options: 'A\nB\nC' });
    await expect(updatePollAction(fd)).rejects.toMatchObject({ digest: 'NEXT_REDIRECT' });

    expect(updateEq).toHaveBeenCalled();
    expect(revalidatePath).toHaveBeenCalledWith('/polls/42');
    expect(revalidatePath).toHaveBeenCalledWith('/polls');
    expect(redirect).toHaveBeenCalledWith('/polls/42?updated=1');
  });
});
