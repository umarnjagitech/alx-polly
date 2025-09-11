import { z } from 'zod';

/**
 * Zod schema for the 'polls' table.
 */
export const pollSchema = z.object({
  id: z.string().uuid(),
  question: z.string(),
  created_by: z.string().uuid().nullable(),
  created_at: z.string(),
});

/**
 * Zod schema for the 'poll_options' table.
 */
export const pollOptionSchema = z.object({
  id: z.string().uuid(),
  poll_id: z.string().uuid(),
  option_text: z.string(),
  position: z.number().int(),
  created_at: z.string(),
});

/**
 * Zod schema for the 'poll_votes' table.
 */
export const pollVoteSchema = z.object({
  id: z.string().uuid(),
  poll_id: z.string().uuid(),
  option_id: z.string().uuid(),
  voter_id: z.string().uuid(),
  created_at: z.string(),
});

/**
 * Zod schema for the 'poll_vote_counts' view.
 */
export const pollVoteCountSchema = z.object({
  poll_id: z.string().uuid().nullable(),
  option_id: z.string().uuid().nullable(),
  option_text: z.string().nullable(),
  votes: z.number().int().nullable(),
});
