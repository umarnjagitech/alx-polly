import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getPolls } from "@/lib/polls";

export default function PollsPage() {
  const polls = getPolls();
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Polls</h1>
        <Link className="underline" href="/polls/new">Create new</Link>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        {polls.map((poll) => (
          <Link key={poll.id} href={`/polls/${poll.id}`}>
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="text-base">{poll.question}</CardTitle>
                <CardDescription>{poll.votes.reduce((a, b) => a + b, 0)} votes</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 dark:text-gray-400">View details →</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}


