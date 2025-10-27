'use client';

import { useEffect, useState, useTransition } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useRouter, useSearchParams } from 'next/navigation';
import { getUserEvents } from '@/lib/queries/events';
import EventCard from '@/components/events/EventCard';
import type { EventCardProps } from '@/components/events/EventCard';

export default function DashboardPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [sportFilter, setSportFilter] = useState(searchParams.get('sport') || '');
  const [events, setEvents] = useState<EventCardProps[]>([]);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    async function loadEvents() {
      const data = await getUserEvents(search, sportFilter);
      setEvents(data || []);
    }

    loadEvents();
  }, [search, sportFilter]);

  const handleFilter = () => {
    const params = new URLSearchParams();
    if (search) params.set('search', search);
    if (sportFilter) params.set('sport', sportFilter);

    startTransition(() => {
      router.push(`/dashboard?${params.toString()}`);
    });
  };

  return (
    <div className="space-y-6 px-4 py-6 sm:px-6 lg:px-8">
      <div className="flex flex-col sm:flex-row sm:items-end gap-4 mb-6">
        <Input
          placeholder="Search events..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full sm:w-1/3"
        />
        <Input
          placeholder="Filter by sport (e.g. basketball)"
          value={sportFilter}
          onChange={(e) => setSportFilter(e.target.value)}
          className="w-full sm:w-1/3"
        />
        <Button onClick={handleFilter} disabled={isPending}>
          {isPending ? 'Filtering...' : 'Apply Filters'}
        </Button>
        <Button variant="outline" onClick={() => router.push('/')}>
          Home
        </Button>
        <Button onClick={() => router.push('/dashboard/create')}>+ Create Event</Button>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {events.length === 0 ? (
          <p className="text-muted-foreground">No events found.</p>
        ) : (
          events.map((event) => (
            <EventCard key={event.id} {...event} />
          ))
        )}
      </div>
    </div>
  );
}
