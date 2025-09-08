import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { requireUserId } from "@/lib/auth/server";
import { createPollWithOptions } from "@/lib/pollService";
import { validateCreatePollApi } from "@/lib/validation/polls";

export async function POST(request: Request) {
  try {
    await requireUserId();
    const requestBody = await request.json();
    const input = validateCreatePollApi(requestBody);
    const poll = await createPollWithOptions(input);
    revalidatePath("/polls");
    return NextResponse.json(poll, { status: 201 });
  } catch (err) {
    if (err instanceof Error) {
      return NextResponse.json({ error: err.message }, { status: 400 });
    }
    return NextResponse.json(
      { error: "Failed to create poll" },
      { status: 500 },
    );
  }
}
