
'use client'

import { createSupabaseClient } from '@/lib/supabase/client'
import { Session } from '@supabase/supabase-js'
import { createContext, useContext, useEffect, useState } from 'react'

export const AuthContext = createContext<Session | null>(null)

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

export const useAuth = () => useContext(AuthContext)
