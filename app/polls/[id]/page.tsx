import { notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const mockPolls = [
  { id: "1", question: "What's your favorite programming language?", options: ["JavaScript", "Python", "Go", "Rust"], votes: [10, 20, 7, 5] },
  { id: "2", question: "Tabs or spaces?", options: ["Tabs", "Spaces"], votes: [12, 15] },
  { id: "3", question: "Best JS framework in 2025?", options: ["Next.js", "SvelteKit", "Nuxt", "Remix"], votes: [8, 3, 2, 2] },
];

export default async function PollDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const poll = mockPolls.find((p) => p.id === id);
  if (!poll) return notFound();

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{poll.question}</CardTitle>
          <CardDescription>{poll.votes.reduce((a, b) => a + b, 0)} total votes</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-3">
            {poll.options.map((opt, idx) => (
              <label key={opt} className="flex items-center gap-3">
                <input type="radio" name="option" value={opt} className="h-4 w-4" />
                <span className="flex-1">{opt}</span>
                <span className="text-xs text-gray-500 dark:text-gray-400">{poll.votes[idx]} votes</span>
              </label>
            ))}
            <Button type="submit">Submit vote</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}


