import { createSupabaseServer } from "@/lib/supabase/server";
import { CreatePollInput, UpdatePollInput } from "@/lib/types/polls";

export async function createPollWithOptions(input: CreatePollInput): Promise<void> {
  const supabase = await createSupabaseServer();
  const { error } = await supabase.rpc("create_poll_with_options", {
    p_question: input.question,
    p_options: input.options,
  });
  if (error) {
    throw new Error(error.message);
  }
}

export async function updatePoll(input: UpdatePollInput): Promise<void> {
  const supabase = await createSupabaseServer();

  const { error: upErr } = await supabase
    .from("polls")
    .update({ question: input.question })
    .eq("id", input.pollId);
  if (upErr) {
    throw new Error(upErr.message);
  }

  const { error: delErr } = await supabase
    .from("poll_options")
    .delete()
    .eq("poll_id", input.pollId);
  if (delErr) {
    throw new Error(delErr.message);
  }

  const rows = input.options.map((opt, idx) => ({ poll_id: input.pollId, option_text: opt, position: idx + 1 }));
  const { error: insErr } = await supabase.from("poll_options").insert(rows);
  if (insErr) {
    throw new Error(insErr.message);
  }
}

export async function deletePoll(pollId: string): Promise<void> {
  const supabase = await createSupabaseServer();
  const { error } = await supabase.from("polls").delete().eq("id", pollId);
  if (error) {
    throw new Error(error.message);
  }
}


