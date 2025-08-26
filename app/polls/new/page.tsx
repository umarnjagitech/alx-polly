import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function NewPollPage() {
  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Create a new poll</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="question">Question</Label>
              <Input id="question" placeholder="What should we ask?" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="options">Options (one per line)</Label>
              <Textarea id="options" placeholder={"Option 1\nOption 2"} />
            </div>
            <Button type="submit">Create poll</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}


