// lib/supabase/server.ts
import { createServerComponentClient, createServerActionClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

// Factory for server components (SSR) to access Supabase with Next cookies
export const createServerComponentSupabaseClient = async () => {
  const cookieStore = await cookies()
  return createServerComponentClient({
    cookies: () => cookieStore as any,
  })
}

// Factory for server actions (app router actions) so auth methods can set
// cookies on the response. Use this inside server actions.
export const createServerActionSupabaseClient = async () => {
  const cookieStore = await cookies()
  return createServerActionClient({
    cookies: () => cookieStore as any,
  })
}