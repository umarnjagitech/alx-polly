"use server";

import { redirect } from "next/navigation";
import { createSupabaseServer } from "@/lib/supabase/server";
import { isRedirectError } from "next/dist/client/components/redirect";
import { revalidatePath } from "next/cache";

export async function createPollAction(formData: FormData) {
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

  const supabase = await createSupabaseServer();

  try {
    const { data, error } = await supabase.rpc("create_poll_with_options", {
      p_question: question,
      p_options: options,
    });

    if (error) {
      throw error;
    }
  } catch (err: any) {
    if (isRedirectError(err) || err?.digest === "NEXT_REDIRECT") {
      throw err;
    }
    const message = typeof err?.message === "string" ? err.message : String(err);
    throw new Error(
      `Failed to create poll. ${message}. Check Supabase URL/key, network, and that you're signed in.`
    );
  }

  revalidatePath("/polls");
  redirect("/polls?created=1");
}

export async function deletePollAction(formData: FormData) {
  const pollId = String(formData.get("poll_id") || "");
  if (!pollId) {
    throw new Error("Missing poll id");
  }

  const supabase = await createSupabaseServer();

  const { error } = await supabase.from("polls").delete().eq("id", pollId);
  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/polls");
  redirect("/polls");
}

export async function updatePollAction(formData: FormData) {
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

  const supabase = await createSupabaseServer();

  // Update question
  const { error: upErr } = await supabase
    .from("polls")
    .update({ question })
    .eq("id", pollId);
  if (upErr) {
    throw new Error(upErr.message);
  }

  // Replace options (delete then insert)
  const { error: delErr } = await supabase
    .from("poll_options")
    .delete()
    .eq("poll_id", pollId);
  if (delErr) {
    throw new Error(delErr.message);
  }

  const rows = options.map((opt, idx) => ({ poll_id: pollId, option_text: opt, position: idx + 1 }));
  const { error: insErr } = await supabase.from("poll_options").insert(rows);
  if (insErr) {
    throw new Error(insErr.message);
  }

  revalidatePath(`/polls/${pollId}`);
  revalidatePath(`/polls`);
  redirect(`/polls/${pollId}?updated=1`);
}


