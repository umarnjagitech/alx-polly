import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { createSupabaseServer } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { updatePollAction } from "@/app/polls/actions";

export default async function EditPollPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const supabase = await createSupabaseServer();
  const { id } = await params;

  const { data: poll, error: pollError } = await supabase
    .from("polls")
    .select("id, question, created_by")
    .eq("id", id)
    .single();
  if (pollError || !poll) return notFound();

  // Only owner can edit; otherwise 404
  const { data: userRes } = await supabase.auth.getUser();
  if (!userRes?.user || userRes.user.id !== poll.created_by) return notFound();

  const { data: options, error: optionsError } = await supabase
    .from("poll_options")
    .select("option_text, position")
    .eq("poll_id", id)
    .order("position", { ascending: true });
  if (optionsError) return notFound();

  const optionsStr = (options || []).map((o: any) => o.option_text).join("\n");

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Edit poll</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" action={updatePollAction}>
            <input type="hidden" name="poll_id" value={poll.id} />
            <div className="space-y-2">
              <Label htmlFor="question">Question</Label>
              <Input
                id="question"
                name="question"
                defaultValue={poll.question}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="options">Options (one per line)</Label>
              <Textarea id="options" name="options" defaultValue={optionsStr} />
            </div>
            <Button type="submit">Save changes</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
