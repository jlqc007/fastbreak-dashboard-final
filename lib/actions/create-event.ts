'use server'

import { z } from 'zod'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

const eventSchema = z.object({
  name: z.string().min(1),
  sport_type: z.string().min(1),
  date: z.string().min(1),
  description: z.string().optional(),
  venues: z.array(z.string()).optional(),
})

export async function createEvent(formData: FormData) {
  const supabase = createServerSupabaseClient()
  const { data: sessionData } = await supabase.auth.getSession()
  const user = sessionData.session?.user

  if (!user) throw new Error('Unauthorized')

  const values = {
    name: formData.get('name'),
    sport_type: formData.get('sport_type'),
    date: formData.get('date'),
    description: formData.get('description'),
    venues: formData.getAll('venues'),
  }

  const parsed = eventSchema.safeParse(values)

  if (!parsed.success) {
    console.error(parsed.error.format())
    return { error: 'Validation failed' }
  }

  const { error } = await supabase.from('events').insert({
    ...parsed.data,
    user_id: user.id,
  })

  if (error) {
    console.error(error.message)
    return { error: 'Failed to create event' }
  }

  revalidatePath('/dashboard') // refresh list
  return { success: true }
}
