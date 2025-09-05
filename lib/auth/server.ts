import { createSupabaseServer } from "@/lib/supabase/server";

/**
 * Require an authenticated user and return their user ID.
 * 
 * Throws an error if the user is not authenticated.
 * Used by server actions to ensure only authenticated users can perform operations.
 */
export async function requireUserId(): Promise<string> {
  const supabase = await createSupabaseServer();
  const { data, error } = await supabase.auth.getUser();
  if (error || !data?.user?.id) {
    throw new Error("Not authenticated");
  }
  return data.user.id;
}


