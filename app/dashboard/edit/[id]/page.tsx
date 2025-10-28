import EventForm, { EventFormData } from '@/components/events/EventForm'
import { createServerComponentSupabaseClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'

export default async function EditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createServerComponentSupabaseClient()
  const { data: event, error } = await supabase
    .from('events')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !event) {
    console.error('Edit page error:', error?.message, 'Event ID:', id)
    return notFound()
  }

  const initialValues: EventFormData = {
    id: event.id,
    name: event.name,
    sport_type: event.sport_type,
    date: event.date,
    description: event.description,
    venues: event.venues?.join(', ') || '',
  }

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <h2 className="text-2xl font-semibold">Edit Event</h2>
      <EventForm initialValues={initialValues} />
    </div>
  )
}
