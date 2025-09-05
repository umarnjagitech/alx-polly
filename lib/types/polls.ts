/**
 * Type definitions for poll-related data structures.
 */

export type UUID = string;

/**
 * Input data for creating a new poll.
 */
export type CreatePollInput = {
  question: string;
  options: string[];
};

/**
 * Input data for updating an existing poll.
 */
export type UpdatePollInput = {
  pollId: UUID;
  question: string;
  options: string[];
};

/**
 * Input data for deleting a poll.
 */
export type DeletePollInput = {
  pollId: UUID;
};


