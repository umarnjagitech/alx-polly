import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { requireUserId } from "@/lib/auth/server";
import { deletePoll, updatePoll } from "@/lib/pollService";
import { validateUpdatePollApi } from "@/lib/validation/polls";

export async function PUT(
  request: Request,
  { params }: { params: { id: string } },
) {
  try {
    const userId = await requireUserId();
    const { id } = params;
    const requestBody = await request.json();
    const input = validateUpdatePollApi(requestBody);
    await updatePoll({ ...input, pollId: id }, userId);

    revalidatePath(`/polls/${id}`);
    revalidatePath(`/polls`);

    return NextResponse.json({ message: "Poll updated successfully" });
  } catch (err) {
    if (err instanceof Error) {
      if (err.message.includes('permission')) {
        return NextResponse.json({ error: err.message }, { status: 403 });
      }
      return NextResponse.json({ error: err.message }, { status: 400 });
    }
    return NextResponse.json(
      { error: "Failed to update poll" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } },
) {
  try {
    const userId = await requireUserId();
    const { id } = params;
    await deletePoll(id, userId);

    revalidatePath(`/polls`);

    return new Response(null, { status: 204 });
  } catch (err) {
    if (err instanceof Error) {
        if (err.message.includes('permission')) {
            return NextResponse.json({ error: err.message }, { status: 403 });
        }
        return NextResponse.json({ error: err.message }, { status: 400 });
    }
    return NextResponse.json(
      { error: "Failed to delete poll" },
      { status: 500 },
    );
  }
}