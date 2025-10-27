import { createServerSupabaseClient } from '@/lib/supabase/server'

export async function getUserEvents(search?: string, sportFilter?: string) {
  const supabase = createServerSupabaseClient()
  const { data: sessionData } = await supabase.auth.getSession()
  const user = sessionData.session?.user

  if (!user) return []

  let query = supabase
    .from('events')
    .select('*')
    .eq('user_id', user.id)

  if (search) {
    query = query.ilike('name', `%${search}%`)
  }

  if (sportFilter) {
    query = query.eq('sport_type', sportFilter)
  }

  const { data, error } = await query.order('date', { ascending: true })

  if (error) {
    console.error('Error loading events:', error.message)
    return []
  }

  return data
}
