export type Poll = {
  id: string;
  question: string;
  options: string[];
  votes: number[];
};

let polls: Poll[] = [
  { id: "1", question: "What's your favorite programming language?", options: ["JavaScript", "Python", "Go", "Rust"], votes: [10, 20, 7, 5] },
  { id: "2", question: "Tabs or spaces?", options: ["Tabs", "Spaces"], votes: [12, 15] },
  { id: "3", question: "Best JS framework in 2025?", options: ["Next.js", "SvelteKit", "Nuxt", "Remix"], votes: [8, 3, 2, 2] },
];

export function getPolls(): Poll[] {
  return polls;
}

export function getPollById(id: string): Poll | undefined {
  return polls.find((p) => p.id === id);
}

export function createPoll(question: string, options: string[]): Poll {
  const id = (polls.length + 1).toString();
  const cleanOptions = options.map((o) => o.trim()).filter(Boolean);
  const votes = new Array(cleanOptions.length).fill(0);
  const poll: Poll = { id, question: question.trim(), options: cleanOptions, votes };
  polls = [poll, ...polls];
  return poll;
}


