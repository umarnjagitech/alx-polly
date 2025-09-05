/**
 * Site header component.
 * 
 * Provides navigation links and authentication controls.
 * Shows user email and logout button when authenticated.
 * Shows login/register buttons when not authenticated.
 */
'use client'

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/app/auth/context";
import { createSupabaseClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export function Header() {
  const session = useAuth();
  const router = useRouter();
  const supabase = createSupabaseClient();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

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
          {session ? (
            <>
              <p className="text-sm text-gray-600 dark:text-gray-400">{session.user.email}</p>
              <Button variant="ghost" onClick={handleLogout}>Logout</Button>
            </>
          ) : (
            <>
              <Link href="/auth/login">
                <Button variant="ghost">Login</Button>
              </Link>
              <Link href="/auth/register">
                <Button>Sign up</Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}


