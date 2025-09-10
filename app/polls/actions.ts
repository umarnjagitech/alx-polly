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
import { createSupabaseServer } from "@/lib/supabase/server";

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
    const userId = await requireUserId();
    const { pollId } = parseDeletePoll(formData);
    await deletePoll(pollId, userId);
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
    const userId = await requireUserId();
    const input = parseUpdatePoll(formData);
    pollId = input.pollId;
    await updatePoll(input, userId);
  } catch (err) {
    return toActionError(err, "Failed to update poll:");
  }

  if (pollId) {
    revalidatePath(`/polls/${pollId}`);
  }
  revalidatePath(`/polls`);
  redirect(`/polls/${pollId}?updated=1`);
}

/**
 * Server Action: Submit a vote for a poll option.
 * 
 * - Requires an authenticated user
 * - Uses upsert to handle duplicate votes gracefully (one vote per user per poll)
 * - Redirects with error parameters if validation fails
 * - Revalidates the poll page to show updated results
 * 
 * @param formData - Form data containing option_id and poll_id
 */
export async function voteAction(formData: FormData) {
  const optionId = String(formData.get("option") || "");
  const pollId = String(formData.get("poll_id") || "");
  
  // Validate required fields
  if (!optionId) {
    return redirect(`/polls/${pollId}?error=no_option`);
  }
  
  // Get authenticated user
  const supabase = await createSupabaseServer();
  const { data: userRes } = await supabase.auth.getUser();
  const voterId = userRes?.user?.id;

  if (!voterId) {
    return redirect(`/polls/${pollId}?error=unauthenticated`);
  }

  // Use upsert to handle duplicate votes gracefully
  const { error } = await supabase
    .from("poll_votes")
    .upsert(
      { poll_id: pollId, option_id: optionId, voter_id: voterId },
      { onConflict: "poll_id,voter_id" },
    );

  if (error) {
    throw new Error("Failed to submit vote. Please try again.");
  }

  revalidatePath(`/polls/${pollId}`);
}