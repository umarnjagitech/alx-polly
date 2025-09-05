import { CreatePollInput, UpdatePollInput } from "@/lib/types/polls";

/**
 * Parse form data for creating a new poll.
 * 
 * Validates that a question is provided and at least 2 options are given.
 * Options are split by newlines and trimmed.
 */
export function parseCreatePoll(formData: FormData): CreatePollInput {
  const questionRaw = String(formData.get("question") || "");
  const optionsRaw = String(formData.get("options") || "");

  const question = questionRaw.trim();
  const options = optionsRaw
    .split("\n")
    .map((o) => o.trim())
    .filter(Boolean);

  if (!question || options.length < 2) {
    throw new Error("Please provide a question and at least two options.");
  }

  return { question, options };
}

/**
 * Parse form data for updating an existing poll.
 * 
 * Validates that poll ID, question, and at least 2 options are provided.
 * Options are split by newlines and trimmed.
 */
export function parseUpdatePoll(formData: FormData): UpdatePollInput {
  const pollId = String(formData.get("poll_id") || "");
  const questionRaw = String(formData.get("question") || "");
  const optionsRaw = String(formData.get("options") || "");

  const question = questionRaw.trim();
  const options = optionsRaw
    .split("\n")
    .map((o) => o.trim())
    .filter(Boolean);

  if (!pollId || !question || options.length < 2) {
    throw new Error("Please provide a question and at least two options.");
  }

  return { pollId, question, options };
}

/**
 * Parse form data for deleting a poll.
 * 
 * Validates that a poll ID is provided.
 */
export function parseDeletePoll(formData: FormData): { pollId: string } {
  const pollId = String(formData.get("poll_id") || "");
  if (!pollId) {
    throw new Error("Missing poll id");
  }
  return { pollId };
}


