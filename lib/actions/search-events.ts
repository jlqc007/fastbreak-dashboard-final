'use server'

import { createServerActionSupabaseClient } from '@/lib/supabase/server'
import type { ActionResult } from './utils'

export async function searchEvents(search: string, sportFilter: string): Promise<ActionResult<any[]>> {
  try {
    const supabase = await createServerActionSupabaseClient()
    
    const { data: sessionData } = await supabase.auth.getSession()
    const userId = sessionData.session?.user?.id

    if (!userId) {
      return { error: 'Unauthorized' }
    }

    let query = supabase
      .from('events')
      .select('*')
      .eq('user_id', userId)
      .order('date', { ascending: false })

    if (search) {
      query = query.ilike('name', `%${search}%`)
    }

    if (sportFilter && sportFilter !== 'all') {
      query = query.eq('sport_type', sportFilter)
    }

    const { data, error } = await query

    if (error) {
      return { error: error.message }
    }

    return { success: data || [] }
  } catch (err: any) {
    return { error: err?.message || 'Failed to search events' }
  }
}
