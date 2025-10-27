import { getUserEvents } from '@/lib/queries/events'
import Link from 'next/link'
import { deleteEvent } from '@/lib/actions/delete-event'

export default async function DashboardPage() {
  const events = await getUserEvents()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">My Events</h2>
        <Link
          href="/dashboard/create"
          className="px-4 py-2 text-sm font-medium bg-primary text-white rounded hover:bg-primary/90"
        >
          + Create Event
        </Link>
      </div>

      {events.length === 0 ? (
        <p className="text-muted-foreground">No events yet. Go make some magic!</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {events.map(event => (
            <form
              key={event.id}
              action={async () => {
                'use server'
                await deleteEvent(event.id)
              }}
              className="border rounded-lg p-4 shadow-sm bg-white dark:bg-zinc-900 space-y-2"
            >
              <div className="space-y-1">
                <h3 className="text-lg font-bold">{event.name}</h3>
                <p className="text-sm text-muted-foreground">
                  {new Date(event.date).toLocaleString()}
                </p>
                <p className="text-sm">{event.sport_type}</p>
                <p className="text-sm text-muted-foreground">
                  {event.venues?.join(', ')}
                </p>
              </div>

              <div className="flex justify-end gap-3 pt-2 text-sm">
                <Link
                  href={`/dashboard/edit/${event.id}`}
                  className="text-blue-600 hover:underline"
                >
                  Edit
                </Link>
                <button
                  type="submit"
                  className="text-red-600 hover:underline"
                >
                  Delete
                </button>
              </div>
            </form>
          ))}
        </div>
      )}
    </div>
  )
}
