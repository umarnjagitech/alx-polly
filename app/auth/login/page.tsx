/**
 * Login page component.
 * 
 * Provides a form for users to authenticate with email and password.
 * Handles form submission and redirects to polls page on success.
 */
'use client'

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";
import { createSupabaseClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createSupabaseClient();

  /**
   * Handle login form submission.
   * 
   * Authenticates user with Supabase and redirects to polls page on success.
   * Shows error message if authentication fails.
   */
  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    
    try {
      // Attempt to sign in with email and password
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        setError(error.message);
      } else {
        // Redirect to polls page on successful login
        router.push("/polls");
      }
    } catch (error: any) {
      // Handle any unexpected errors
      setError(error.message);
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Login</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={handleLogin}>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <Button type="submit" className="w-full">Sign in</Button>
          </form>
          <p className="text-sm text-gray-600 mt-4 dark:text-gray-400">
            No account? <Link href="/auth/register" className="underline">Sign up</Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}


