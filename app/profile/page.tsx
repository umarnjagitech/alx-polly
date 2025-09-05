/**
 * User profile page component.
 * 
 * Displays basic user information for authenticated users.
 * Redirects to login page if user is not authenticated.
 */
'use client'

import { useAuth } from "@/app/auth/context";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ProfilePage() {
  const session = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!session) {
      router.push("/auth/login");
    }
  }, [session, router]);

  if (!session) {
    return null;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold">Profile</h1>
      <p>Email: {session.user.email}</p>
    </div>
  );
}
