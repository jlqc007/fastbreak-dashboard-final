'use server'

import { z } from 'zod'
import { createServerActionSupabaseClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { withAction } from './utils'

const updateSchema = z.object({
  name: z.string().min(1),
  sport_type: z.string().min(1),
  date: z.string().min(1),
  description: z.string().optional(),
  venues: z.array(z.string()).optional(),
})

export async function updateEvent(id: string, formData: FormData) {
  return await withAction(async () => {
  const supabase = await createServerActionSupabaseClient()
    const values = {
      name: formData.get('name'),
      sport_type: formData.get('sport_type'),
      date: formData.get('date'),
      description: formData.get('description'),
      venues: formData.getAll('venues'),
    }

    const parsed = updateSchema.parse(values)

    const { error } = await supabase
      .from('events')
      .update(parsed)
      .eq('id', id)

    if (error) throw new Error(error.message)

    revalidatePath('/dashboard')
    return true
  })
}
