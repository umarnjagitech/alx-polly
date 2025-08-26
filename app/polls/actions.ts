"use server";

import { createPoll } from "@/lib/polls";
import { redirect } from "next/navigation";

export async function createPollAction(formData: FormData) {
  const question = String(formData.get("question") || "");
  const optionsStr = String(formData.get("options") || "");
  const options = optionsStr.split("\n");
  const poll = createPoll(question, options);
  redirect(`/polls/${poll.id}`);
}


