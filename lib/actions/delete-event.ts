'use server'

import { createServerActionSupabaseClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { withAction } from './utils'

export async function deleteEvent(id: string) {
  return await withAction(async () => {
  const supabase = await createServerActionSupabaseClient()

    const { error } = await supabase.from('events').delete().eq('id', id)

    if (error) throw new Error(error.message)

    revalidatePath('/dashboard')
    return true
  })
}
