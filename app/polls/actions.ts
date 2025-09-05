"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import {
  parseCreatePoll,
  parseDeletePoll,
  parseUpdatePoll,
} from "@/lib/validation/polls";
import { requireUserId } from "@/lib/auth/server";
import {
  createPollWithOptions,
  deletePoll,
  updatePoll,
} from "@/lib/pollService";
import { toActionError } from "@/lib/errors";
import { StandardActionResult } from "@/lib/types/polls";

/**
 * Server Action: Create a poll.
 * - Requires an authenticated user
 * - Validates input using `parseCreatePoll`
 * - Calls `createPollWithOptions`
 * - Revalidates and redirects on success
 */
export async function createPollAction(
  formData: FormData,
): Promise<StandardActionResult<void> | void> {
  try {
    await requireUserId();
    const input = parseCreatePoll(formData);
    await createPollWithOptions(input);
  } catch (err) {
    return toActionError(err, "Failed to create poll:");
  }

  revalidatePath("/polls");
  redirect("/polls?created=1");
}

/**
 * Server Action: Delete a poll by id.
 * - Requires an authenticated user
 * - Validates input using `parseDeletePoll`
 * - Revalidates and redirects back to the listing
 */
export async function deletePollAction(
  formData: FormData,
): Promise<StandardActionResult<void> | void> {
  try {
    await requireUserId();
    const { pollId } = parseDeletePoll(formData);
    await deletePoll(pollId);
  } catch (err) {
    return toActionError(err, "Failed to delete poll:");
  }

  revalidatePath("/polls");
  redirect("/polls");
}

/**
 * Server Action: Update a poll and its options.
 * - Requires an authenticated user
 * - Validates input using `parseUpdatePoll`
 * - Revalidates poll detail and listing pages and redirects back
 */
export async function updatePollAction(
  formData: FormData,
): Promise<StandardActionResult<void> | void> {
  let pollId: string | null = null;
  try {
    await requireUserId();
    const input = parseUpdatePoll(formData);
    pollId = input.pollId;
    await updatePoll(input);
  } catch (err) {
    return toActionError(err, "Failed to update poll:");
  }

  if (pollId) {
    revalidatePath(`/polls/${pollId}`);
  }
  revalidatePath(`/polls`);
  redirect(`/polls/${pollId}?updated=1`);
}
