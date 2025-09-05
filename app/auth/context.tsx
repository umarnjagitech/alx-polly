/**
 * Authentication context and provider for client-side auth state management.
 * 
 * Provides session state to child components and handles auth state changes.
 * Uses Supabase client to listen for authentication events.
 */

'use client'

import { createSupabaseClient } from '@/lib/supabase/client'
import { Session } from '@supabase/supabase-js'
import { createContext, useContext, useEffect, useState } from 'react'

/**
 * Context for sharing authentication session state.
 */
export const AuthContext = createContext<Session | null>(null)

/**
 * Provider component that manages authentication state.
 * 
 * Initializes session on mount and listens for auth state changes.
 * Cleans up subscription on unmount.
 */
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const supabase = createSupabaseClient()
  const [session, setSession] = useState<Session | null>(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session)
      }
    )

    return () => {
      authListener.subscription.unsubscribe()
    }
  }, [])

  return <AuthContext.Provider value={session}>{children}</AuthContext.Provider>
}

/**
 * Hook to access the current authentication session.
 * 
 * Returns the current session or null if not authenticated.
 */
export const useAuth = () => useContext(AuthContext)
