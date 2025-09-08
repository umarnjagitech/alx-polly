import { describe, it, expect, vi, beforeEach } from 'vitest';
import { POST as postPoll } from '@/app/api/polls/route';
import { PUT as putPoll, DELETE as deletePoll } from '@/app/api/polls/[id]/route';
import { requireUserId } from '@/lib/auth/server';
import { createPollWithOptions, deletePoll as deletePollService, updatePoll } from '@/lib/pollService';
import { revalidatePath } from 'next/cache';

vi.mock('@/lib/auth/server', () => ({
  requireUserId: vi.fn(async () => 'user-1'),
}));

vi.mock('@/lib/pollService', () => ({
  createPollWithOptions: vi.fn(async (data) => ({ ...data, id: 'new-poll-id' })),
  deletePoll: vi.fn(async () => {}),
  updatePoll: vi.fn(async () => {}),
}));

vi.mock('next/cache', () => ({
  revalidatePath: vi.fn(),
}));

describe('API /api/polls', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('POST', () => {
    it('should create a poll and return it', async () => {
      const request = new Request('http://localhost/api/polls', {
        method: 'POST',
        body: JSON.stringify({ question: 'Test Question?', options: ['A', 'B'] }),
      });

      const response = await postPoll(request);
      const data = await response.json();

      expect(response.status).toBe(201);
      expect(data.question).toBe('Test Question?');
      expect(data.id).toBe('new-poll-id');
      expect(createPollWithOptions).toHaveBeenCalledWith({ question: 'Test Question?', options: ['A', 'B'] });
      expect(revalidatePath).toHaveBeenCalledWith('/polls');
    });

    it('should return 400 for invalid data', async () => {
        const request = new Request('http://localhost/api/polls', {
            method: 'POST',
            body: JSON.stringify({ question: 'Only one option', options: ['A'] }),
        });

        const response = await postPoll(request);
        expect(response.status).toBe(400);
    });
  });
});

describe('API /api/polls/[id]', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('PUT', () => {
        it('should update a poll and return a success message', async () => {
            const request = new Request('http://localhost/api/polls/poll-123', {
                method: 'PUT',
                body: JSON.stringify({ question: 'Updated Question', options: ['C', 'D'] }),
            });

            const response = await putPoll(request, { params: { id: 'poll-123' } });
            const data = await response.json();

            expect(response.status).toBe(200);
            expect(data.message).toBe('Poll updated successfully');
            expect(updatePoll).toHaveBeenCalledWith({ pollId: 'poll-123', question: 'Updated Question', options: ['C', 'D'] }, 'user-1');
            expect(revalidatePath).toHaveBeenCalledWith('/polls/poll-123');
            expect(revalidatePath).toHaveBeenCalledWith('/polls');
        });

        it('should return 403 if user is not authorized', async () => {
            (updatePoll as vi.Mock).mockRejectedValue(new Error('permission denied'));
            const request = new Request('http://localhost/api/polls/poll-123', {
                method: 'PUT',
                body: JSON.stringify({ question: 'Updated Question', options: ['C', 'D'] }),
            });

            const response = await putPoll(request, { params: { id: 'poll-123' } });
            expect(response.status).toBe(403);
        });
    });

    describe('DELETE', () => {
        it('should delete a poll and return 204', async () => {
            const request = new Request('http://localhost/api/polls/poll-123', {
                method: 'DELETE',
            });

            const response = await deletePoll(request, { params: { id: 'poll-123' } });

            expect(response.status).toBe(204);
            expect(deletePollService).toHaveBeenCalledWith('poll-123', 'user-1');
            expect(revalidatePath).toHaveBeenCalledWith('/polls');
        });

        it('should return 403 if user is not authorized', async () => {
            (deletePollService as vi.Mock).mockRejectedValue(new Error('permission denied'));
            const request = new Request('http://localhost/api/polls/poll-123', {
                method: 'DELETE',
            });

            const response = await deletePoll(request, { params: { id: 'poll-123' } });
            expect(response.status).toBe(403);
        });
    });
});