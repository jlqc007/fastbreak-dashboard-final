import { redirect } from 'next/navigation'
import { createServerComponentSupabaseClient } from '@/lib/supabase/server'

export default async function Home() {
  // Check if user is already logged in
  const supabase = await createServerComponentSupabaseClient()
  const { data: { session } } = await supabase.auth.getSession()
  
  // If logged in, redirect to dashboard
  if (session?.user) {
    redirect('/dashboard')
  }
  
  // Otherwise, redirect to login
  redirect('/login')
}
