'use client';

import { useEffect, useState, useTransition } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useRouter, useSearchParams } from 'next/navigation';
import { getUserEvents } from '@/lib/queries/events';
import EventCard from '@/components/events/EventCard';

export default function DashboardPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [sportFilter, setSportFilter] = useState(searchParams.get('sport') || '');
  const [events, setEvents] = useState<
    { id: string; name: string; date: string; venue: string; sport: string }[]
  >([]);
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
      {/* Filters */}
      <div className="flex flex-col sm:flex-row sm:items-end gap-4">
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
        <Button
          onClick={handleFilter}
          disabled={isPending}
          className="sm:w-1/6"
        >
          {isPending ? 'Filtering...' : 'Apply Filters'}
        </Button>
      </div>

      {/* Events Grid */}
      <div>
        <h2 className="text-xl font-semibold text-foreground mb-4">Your Events</h2>
        {events.length === 0 ? (
          <p className="text-muted-foreground text-sm">No events found.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => (
              <EventCard key={event.id} {...event} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
