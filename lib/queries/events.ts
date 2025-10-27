// lib/queries/events.ts
import { createServerSupabaseClient } from '@/lib/supabase/server'

export async function getUserEvents() {
  const supabase = createServerSupabaseClient()
  const { data: sessionData } = await supabase.auth.getSession()
  const user = sessionData.session?.user

  if (!user) return []

  const { data, error } = await supabase
    .from('events')
    .select('*')
    .eq('user_id', user.id)
    .order('date', { ascending: true })

  if (error) {
    console.error('Error loading events:', error.message)
    return []
  }

  return data
}
