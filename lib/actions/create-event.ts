'use server'

import { z } from 'zod'
import { createServerActionSupabaseClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { withAction } from './utils'

const eventSchema = z.object({
  name: z.string().min(1),
  sport_type: z.string().min(1),
  date: z.string().min(1),
  description: z.string().optional(),
  venues: z.array(z.string()).optional(),
})

export async function createEvent(formData: FormData) {
  return await withAction(async () => {
  const supabase = await createServerActionSupabaseClient()
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

    const parsed = eventSchema.parse(values)

    const { error } = await supabase.from('events').insert({
      ...parsed,
      user_id: user.id,
    })

    if (error) throw new Error(error.message)

    revalidatePath('/dashboard') // refresh list
    return true
  })
}
