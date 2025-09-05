/**
 * In-Memory Poll Data Management
 *
 * This module provides a simple in-memory data layer for managing polls in the ALX Polly application.
 * It serves as a temporary data store before integration with a persistent database like Supabase.
 *
 * Context in the app:
 * - Acts as the data source for poll-related operations throughout the application
 * - Used by server actions in `/app/polls/actions.ts` for CRUD operations
 * - Provides data to poll listing pages (`/polls`) and detail pages (`/polls/[id]`)
 * - Will eventually be replaced by Supabase database operations in production
 *
 * Key responsibilities:
 * - Store poll data structure with questions, options, and vote counts
 * - Provide CRUD operations (Create, Read) for polls
 * - Maintain vote tallies for each poll option
 * - Support poll retrieval by ID and listing all polls
 *
 * Data Flow:
 * 1. UI components call server actions
 * 2. Server actions use these functions to manipulate poll data
 * 3. Updated data is returned to UI for display
 *
 * @fileoverview In-memory poll data management utilities
 */

/**
 * Represents a complete poll with all its data.
 * This is the main data structure used throughout the application for poll operations.
 */
export type Poll = {
  /** Unique identifier for the poll */
  id: string;
  /** The poll question text */
  question: string;
  /** Array of option texts that users can vote for */
  options: string[];
  /** Array of vote counts corresponding to each option (same index) */
  votes: number[];
};

/**
 * Represents poll data needed for editing operations.
 * This is a subset of Poll data used when updating poll information.
 */
export type EditPollData = {
  /** Unique identifier for the poll */
  id: string;
  /** The poll question text */
  question: string;
  /** ID of the user who created the poll */
  created_by: string;
};

/**
 * In-memory storage for all polls.
 * This array serves as our temporary database until Supabase integration is complete.
 * New polls are added to the beginning of the array for chronological ordering.
 */
let polls: Poll[] = [
  {
    id: "1",
    question: "What's your favorite programming language?",
    options: ["JavaScript", "Python", "Go", "Rust"],
    votes: [10, 20, 7, 5],
  },
  {
    id: "2",
    question: "Tabs or spaces?",
    options: ["Tabs", "Spaces"],
    votes: [12, 15],
  },
  {
    id: "3",
    question: "Best JS framework in 2025?",
    options: ["Next.js", "SvelteKit", "Nuxt", "Remix"],
    votes: [8, 3, 2, 2],
  },
];

/**
 * Retrieves all polls from the in-memory store.
 *
 * This function is used by:
 * - The polls listing page (`/polls`) to display all available polls
 * - Dashboard components that need to show poll summaries
 * - Any component that needs to iterate over all polls
 *
 * @returns Array of all polls, ordered with newest first
 *
 * @example
 * ```typescript
 * const allPolls = getPolls();
 * console.log(`Total polls: ${allPolls.length}`);
 * ```
 */
export function getPolls(): Poll[] {
  return polls;
}

/**
 * Retrieves a specific poll by its unique ID.
 *
 * This function is used by:
 * - Poll detail pages (`/polls/[id]`) to display individual poll information
 * - Voting components that need poll data for vote submission
 * - Edit forms that need to pre-populate with existing poll data
 *
 * @param id - The unique identifier of the poll to retrieve
 * @returns The poll object if found, undefined otherwise
 *
 * @example
 * ```typescript
 * const poll = getPollById("1");
 * if (poll) {
 *   console.log(poll.question);
 * } else {
 *   console.log("Poll not found");
 * }
 * ```
 */
export function getPollById(id: string): Poll | undefined {
  return polls.find((p) => p.id === id);
}

/**
 * Creates a new poll and adds it to the in-memory store.
 *
 * This function handles:
 * - Generating a unique ID for the new poll
 * - Cleaning and validating option text (trim whitespace, remove empty options)
 * - Initializing vote counts to zero for all options
 * - Adding the poll to the beginning of the polls array (newest first)
 *
 * Used by:
 * - Server actions in `/app/polls/actions.ts` when processing poll creation forms
 * - Poll creation forms (`/polls/new`) after form submission
 *
 * @param question - The poll question text (will be trimmed)
 * @param options - Array of option texts (will be cleaned and filtered)
 * @returns The newly created poll object with generated ID and zero vote counts
 *
 * @example
 * ```typescript
 * const newPoll = createPoll(
 *   "What's your favorite color?",
 *   ["Red", "Blue", "Green", ""] // Empty option will be filtered out
 * );
 * console.log(newPoll.id); // "4" (if 3 polls existed before)
 * console.log(newPoll.votes); // [0, 0, 0] (3 valid options)
 * ```
 */
export function createPoll(question: string, options: string[]): Poll {
  const id = (polls.length + 1).toString();
  const cleanOptions = options.map((o) => o.trim()).filter(Boolean);
  const votes = new Array(cleanOptions.length).fill(0);
  const poll: Poll = {
    id,
    question: question.trim(),
    options: cleanOptions,
    votes,
  };
  polls = [poll, ...polls];
  return poll;
}
