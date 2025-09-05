/**
 * Polls listing page component.
 * 
 * Displays all polls with vote counts and provides navigation to create new polls.
 * Shows success message when a poll is created.
 * Allows poll creators to delete their own polls.
 */
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { createSupabaseServer } from "@/lib/supabase/server";
import { deletePollAction } from "@/app/polls/actions";

export default async function PollsPage(props: {
  searchParams?: Promise<{ [key: string]: string | undefined }>;
}) {
  const supabase = await createSupabaseServer();

  // Resolve searchParams first
  const searchParams = props.searchParams ? await props.searchParams : {};
  const created = searchParams?.created === "1";

  let polls: any[] = [];
  let counts: any[] = [];
  let userId: string | undefined;
  let loadError: string | null = null;

  try {
    const [
      { data: pollsData, error: pollsError },
      { data: countsData, error: countsError },
      { data: userRes },
    ] = await Promise.all([
      supabase
        .from("polls")
        .select("id, question, created_at, created_by")
        .order("created_at", { ascending: false }),
      supabase.from("poll_vote_counts").select("poll_id, votes"),
      supabase.auth.getUser(),
    ]);

    if (pollsError) throw pollsError;
    if (countsError) throw countsError;

    polls = pollsData || [];
    counts = countsData || [];
    userId = userRes?.user?.id;
  } catch (err: any) {
    loadError = typeof err?.message === "string" ? err.message : String(err);
  }

  const totalVotesByPoll = new Map<string, number>();
  (counts || []).forEach((c: any) => {
    totalVotesByPoll.set(
      c.poll_id as string,
      (totalVotesByPoll.get(c.poll_id as string) || 0) + Number(c.votes || 0),
    );
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Polls</h1>
        <Link className="underline" href="/polls/new">
          Create new
        </Link>
      </div>

      {created && (
        <div className="rounded-md bg-green-50 dark:bg-green-900/20 p-3 text-green-800 dark:text-green-200 text-sm">
          Poll created successfully.
        </div>
      )}

      {loadError && (
        <div className="rounded-md bg-red-50 dark:bg-red-900/20 p-3 text-red-800 dark:text-red-200 text-sm">
          Failed to load polls: {loadError}
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        {(polls || []).map((poll: any) => (
          <div key={poll.id} className="relative">
            <Link href={`/polls/${poll.id}`}>
              <Card className="h-full">
                <CardHeader>
                  <CardTitle className="text-base">{poll.question}</CardTitle>
                  <CardDescription>
                    {totalVotesByPoll.get(poll.id) || 0} votes
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    View details →
                  </p>
                </CardContent>
              </Card>
            </Link>

            {userId && poll.created_by === userId && (
              <form
                action={deletePollAction}
                className="absolute top-2 right-2"
              >
                <input type="hidden" name="poll_id" value={poll.id} />
                <button
                  type="submit"
                  className="text-xs underline text-red-600 dark:text-red-400"
                >
                  Delete
                </button>
              </form>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
