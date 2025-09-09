/**
 * Registration page component.
 * 
 * Provides a form for new users to create an account.
 * Handles form submission and shows success message before redirecting to login.
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

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createSupabaseClient();

  /**
   * Handle registration form submission.
   * 
   * Creates new user account with Supabase and shows success message.
   * Redirects to login page after 3 seconds on successful registration.
   */
  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    
    try {
      // Attempt to create new user account
      const { error } = await supabase.auth.signUp({
        email,
        password,
      });
      
      if (error) {
        setError(error.message);
      } else {
        // Show success message and redirect after delay
        setSuccess("Registration successful! Please check your email to confirm your account.");
        setTimeout(() => {
          router.push("/auth/login");
        }, 3000); // 3 second delay to show success message
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
          <CardTitle>Create account</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={handleRegister}>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            {success && <p className="text-green-500 text-sm">{success}</p>}
            <Button type="submit" className="w-full">Sign up</Button>
          </form>
          <p className="text-sm text-gray-600 mt-4 dark:text-gray-400">
            Already have an account? <Link href="/auth/login" className="underline">Sign in</Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}


