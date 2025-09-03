import { createSupabaseServer } from "@/lib/supabase/server";

export async function requireUserId(): Promise<string> {
  const supabase = await createSupabaseServer();
  const { data, error } = await supabase.auth.getUser();
  if (error || !data?.user?.id) {
    throw new Error("Not authenticated");
  }
  return data.user.id;
}


