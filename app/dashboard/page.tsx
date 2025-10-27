import { getUserEvents } from "@/lib/queries/events";
import { EventCard } from "@/components/events/EventCard";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function DashboardPage() {
  const events = await getUserEvents();

  return (
    <main className="container py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">My Events</h1>
        <Link href="/create">
          <Button variant="default">+ Create Event</Button>
        </Link>
      </div>

      {events.length === 0 ? (
        <div className="text-center text-muted-foreground">No events found.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <EventCard
              key={event.id}
              id={event.id}
              name={event.name}
              date={event.date}
              venue={event.venues}
              sport={event.sport_type}
            />
          ))}
        </div>
      )}
    </main>
  );
}
