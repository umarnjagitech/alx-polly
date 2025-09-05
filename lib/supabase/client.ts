import { createBrowserClient } from '@supabase/ssr'

/**
 * Create a Supabase client configured for client-side operations.
 * 
 * Uses browser environment variables for authentication.
 * Requires NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY environment variables.
 */
export const createSupabaseClient = () =>
  createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
