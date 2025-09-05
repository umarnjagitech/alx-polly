/**
 * Poll details page component.
 * 
 * Displays a poll with voting form and results chart.
 * Handles voting with upsert to allow vote changes.
 * Shows edit link for poll creators.
 * Includes server action for vote submission.
 */
import { notFound } from "next/navigation";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { createSupabaseServer } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import Link from "next/link";
import PollResultChart from "@/components/PollResultChart";

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

  if (!voterId) {
    throw new Error("You must be logged in to vote.");
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

export default async function PollDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createSupabaseServer();

  const { data: poll, error: pollError } = await supabase
    .from("polls")
    .select("id, question, created_at, created_by")
    .eq("id", id)
    .single();

  if (pollError || !poll) return notFound();

  const [
    { data: options, error: optionsError },
    { data: counts, error: countsError },
    { data: userRes },
  ] = await Promise.all([
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

  // Get existing vote if user is logged in
  let existingVote = null;
  if (userRes?.user?.id) {
    const { data: voteData } = await supabase
      .from("poll_votes")
      .select("option_id")
      .eq("poll_id", id)
      .eq("voter_id", userRes.user.id)
      .single();
    existingVote = voteData;
  }

  if (optionsError || !options || countsError) return notFound();

  const votesByOptionId = new Map<string, number>(
    (counts || []).map((c: any) => [
      c.option_id as string,
      Number(c.votes) || 0,
    ]),
  );
  const totalVotes = options.reduce(
    (sum, opt) => sum + (votesByOptionId.get(opt.id) || 0),
    0,
  );
  const canEdit = userRes?.user?.id && userRes.user.id === poll.created_by;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Voting Form */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>{poll.question}</CardTitle>
                <CardDescription>{totalVotes} total votes</CardDescription>
              </div>
              {canEdit && (
                <Link
                  className="text-sm underline"
                  href={`/polls/${poll.id}/edit`}
                >
                  Edit
                </Link>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {existingVote && (
              <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                <p className="text-sm text-blue-800 dark:text-blue-200">
                  ✓ You have already voted. You can change your vote below.
                </p>
              </div>
            )}
            <form className="space-y-3" action={voteAction}>
              <input type="hidden" name="poll_id" value={poll.id} />
              {options.map((opt) => {
                const isUserChoice = existingVote?.option_id === opt.id;
                return (
                  <label
                    key={opt.id}
                    className={`flex items-center gap-3 p-3 rounded-lg border transition-colors cursor-pointer ${
                      isUserChoice
                        ? "border-blue-300 bg-blue-50 dark:border-blue-700 dark:bg-blue-900/20"
                        : "border-gray-200 hover:border-gray-300 dark:border-gray-700 dark:hover:border-gray-600"
                    }`}
                  >
                    <input
                      type="radio"
                      name="option"
                      value={opt.id}
                      className="h-4 w-4"
                      defaultChecked={isUserChoice}
                    />
                    <span className="flex-1 font-medium">
                      {opt.option_text}
                    </span>
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-gray-500 dark:text-gray-400">
                        {votesByOptionId.get(opt.id) || 0} votes
                      </span>
                      {isUserChoice && (
                        <span className="px-2 py-1 bg-blue-600 text-white text-xs rounded-full">
                          Your vote
                        </span>
                      )}
                    </div>
                  </label>
                );
              })}
              <Button type="submit" className="w-full">
                {existingVote ? "Update vote" : "Submit vote"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Results Chart */}
        <PollResultChart
          question={poll.question}
          options={options}
          votesByOptionId={votesByOptionId}
          totalVotes={totalVotes}
          showTitle={false}
        />
      </div>
    </div>
  );
}
