'use client';

import { useEffect, useState, useTransition } from 'react';
import { Input } from '../../components/ui/input';
import { Button } from '../../components/ui/button';
import { useRouter, useSearchParams } from 'next/navigation';
import { getUserEvents } from '@/lib/queries/events';
import EventCard from '@/components/events/EventCard';

type Event = {
  id: string;
  name: string;
  date: string;
  venue: string;
  sport: string;
};

export default function DashboardPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [sportFilter, setSportFilter] = useState(searchParams.get('sport') || '');
  const [events, setEvents] = useState<Event[]>([]);
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
    <div className="p-4 space-y-6 max-w-6xl mx-auto">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4 gap-2">
        <Input
          placeholder="Search events..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full sm:w-1/2"
        />
        <Input
          placeholder="Filter by sport (e.g. basketball)"
          value={sportFilter}
          onChange={(e) => setSportFilter(e.target.value)}
          className="w-full sm:w-1/3"
        />
        <Button onClick={handleFilter} disabled={isPending} className="sm:w-auto w-full">
          {isPending ? 'Filtering...' : 'Apply Filters'}
        </Button>
      </div>

      {/* Events */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.length === 0 ? (
          <p className="text-muted-foreground text-sm">No events found.</p>
        ) : (
          events.map((event) => (
            <EventCard
              key={event.id}
              id={event.id}
              name={event.name}
              date={event.date}
              venue={event.venue}
              sport={event.sport}
            />
          ))
        )}
      </div>
    </div>
  );
}
