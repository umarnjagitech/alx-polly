import { notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { createSupabaseServer } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import Link from "next/link";

async function voteAction(formData: FormData) {
  "use server";
  const optionId = String(formData.get("option") || "");
  const pollId = String(formData.get("poll_id") || "");
  if (!optionId || !pollId) {
    throw new Error("Please select an option.");
  }
  const supabase = await createSupabaseServer();
  const { data: userRes } = await supabase.auth.getUser();
  const voterId = userRes?.user?.id;
  const { error } = await supabase.from("poll_votes").insert({ poll_id: pollId, option_id: optionId, voter_id: voterId });
  if (error) {
    throw new Error(error.message);
  }
  revalidatePath(`/polls/${pollId}`);
}

export default async function PollDetailsPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const supabase = await createSupabaseServer();

  const { data: poll, error: pollError } = await supabase
    .from("polls")
    .select("id, question, created_at, created_by")
    .eq("id", id)
    .single();

  if (pollError || !poll) return notFound();

  const [{ data: options, error: optionsError }, { data: counts, error: countsError }, { data: userRes }] = await Promise.all([
    supabase
      .from("poll_options")
      .select("id, option_text, position")
      .eq("poll_id", id)
      .order("position", { ascending: true }),
    supabase
      .from("poll_vote_counts")
      .select("option_id, votes")
      .eq("poll_id", id),
    supabase.auth.getUser(),
  ]);

  if (optionsError || !options || countsError) return notFound();

  const votesByOptionId = new Map<string, number>((counts || []).map((c: any) => [c.option_id as string, Number(c.votes) || 0]));
  const totalVotes = options.reduce((sum, opt) => sum + (votesByOptionId.get(opt.id) || 0), 0);
  const canEdit = userRes?.user?.id && userRes.user.id === poll.created_by;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>{poll.question}</CardTitle>
              <CardDescription>{totalVotes} total votes</CardDescription>
            </div>
            {canEdit && (
              <Link className="text-sm underline" href={`/polls/${poll.id}/edit`}>
                Edit
              </Link>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <form className="space-y-3" action={voteAction}>
            <input type="hidden" name="poll_id" value={poll.id} />
            {options.map((opt) => (
              <label key={opt.id} className="flex items-center gap-3">
                <input type="radio" name="option" value={opt.id} className="h-4 w-4" />
                <span className="flex-1">{opt.option_text}</span>
                <span className="text-xs text-gray-500 dark:text-gray-400">{votesByOptionId.get(opt.id) || 0} votes</span>
              </label>
            ))}
            <Button type="submit">Submit vote</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}


