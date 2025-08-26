import Link from "next/link";
import { Button } from "@/components/ui/button";

export function Header() {
  return (
    <header className="border-b border-gray-200 dark:border-gray-800">
      <div className="mx-auto max-w-5xl px-4 h-14 flex items-center justify-between">
        <nav className="flex items-center gap-6 text-sm">
          <Link href="/" className="font-semibold">
            alx-polly
          </Link>
          <Link href="/polls" className="text-gray-600 hover:text-black dark:text-gray-300 dark:hover:text-white">
            Polls
          </Link>
          <Link href="/polls/new" className="text-gray-600 hover:text-black dark:text-gray-300 dark:hover:text-white">
            New Poll
          </Link>
        </nav>
        <div className="flex items-center gap-2">
          <Link href="/auth/login">
            <Button variant="ghost">Login</Button>
          </Link>
          <Link href="/auth/register">
            <Button>Sign up</Button>
          </Link>
        </div>
      </div>
    </header>
  );
}


