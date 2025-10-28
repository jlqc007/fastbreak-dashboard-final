"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import EventCard from '@/components/events/EventCard';
import type { EventCardProps } from '@/components/events/EventCard';

type DashboardClientProps = {
  initialEvents: EventCardProps[];
};

export default function DashboardClient({ initialEvents }: DashboardClientProps) {
  const [events, setEvents] = useState<EventCardProps[]>(initialEvents);
  const [search, setSearch] = useState('');
  const router = useRouter();

  const filteredEvents = events.filter((event) =>
    event.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <main className="p-6 space-y-4">
      <div className="flex justify-between items-center">
        <Input
          placeholder="Search events..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-md"
        />
        <Button onClick={() => router.push('/dashboard/create')}>
          + New Event
        </Button>
      </div>

      {filteredEvents.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredEvents.map((event) => (
            <EventCard
              key={event.id}
              {...event}
              onDelete={(id) => setEvents((prev) => prev.filter((e) => e.id !== id))}
            />
          ))}
        </div>
      ) : (
        <p className="text-gray-500">No events found.</p>
      )}
    </main>
  );
}
