import EventForm from '@/components/events/EventForm'

export default function CreateEventPage() {
  return (
    <div className="max-w-xl mx-auto space-y-6">
      <h2 className="text-2xl font-semibold">Create Event</h2>
      <EventForm />
    </div>
  )
}
