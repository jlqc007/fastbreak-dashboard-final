'use server'

import { createServerSupabaseClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function deleteEvent(id: string) {
  const supabase = createServerSupabaseClient()

  const { error } = await supabase.from('events').delete().eq('id', id)

  if (error) {
    console.error(error.message)
    return { error: 'Failed to delete event' }
  }

  revalidatePath('/dashboard')
  return { success: true }
}
