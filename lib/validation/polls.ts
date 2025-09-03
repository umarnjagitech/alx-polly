import { CreatePollInput, UpdatePollInput } from "@/lib/types/polls";

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

export function parseDeletePoll(formData: FormData): { pollId: string } {
  const pollId = String(formData.get("poll_id") || "");
  if (!pollId) {
    throw new Error("Missing poll id");
  }
  return { pollId };
}


