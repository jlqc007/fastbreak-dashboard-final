// app/dashboard/page.tsx
import { getUserEvents } from '@/lib/queries/events'

export default async function DashboardPage() {
  const events = await getUserEvents()

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold">My Events</h2>

      {events.length === 0 ? (
        <p className="text-muted-foreground">No events yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {events.map(event => (
            <div
              key={event.id}
              className="border rounded-lg p-4 shadow-sm bg-white dark:bg-zinc-900"
            >
              <h3 className="text-lg font-bold">{event.name}</h3>
              <p className="text-sm text-muted-foreground">
                {new Date(event.date).toLocaleString()}
              </p>
              <p className="text-sm mt-1">{event.sport_type}</p>
              <p className="text-sm text-muted-foreground mt-1">
                {event.venues?.join(', ')}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
