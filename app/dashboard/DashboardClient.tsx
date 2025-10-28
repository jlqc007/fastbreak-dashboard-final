"use client";

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import EventCard from '@/components/events/EventCard';
import { searchEvents } from '@/lib/actions/search-events';
import { toast } from 'sonner';

type DashboardEvent = {
  id: string;
  name: string;
  date: string;
  sport_type: string;
  description?: string | null;
  venues?: string[] | null;
};

type DashboardClientProps = {
  initialEvents: DashboardEvent[];
};

export default function DashboardClient({ initialEvents }: DashboardClientProps) {
  const [events, setEvents] = useState<DashboardEvent[]>(initialEvents);
  const [search, setSearch] = useState('');
  const [sportFilter, setSportFilter] = useState('all');
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    try {
      setLoading(true);
      const result = await searchEvents(search, sportFilter);
      if (result?.error) {
        toast.error(result.error);
        return;
      }
      if (result?.success) {
        setEvents(result.success);
      }
    } catch (err: any) {
      toast.error(err?.message || 'Search failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="p-6 space-y-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">My Events</h1>
        <Button onClick={() => (window.location.href = '/dashboard/create')}>
          + New Event
        </Button>
      </div>

      <div className="flex gap-2 mb-6">
        <Input
          placeholder="Search events by name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1"
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleSearch();
            }
          }}
        />
        <Select value={sportFilter} onValueChange={setSportFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by sport" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Sports</SelectItem>
            <SelectItem value="basketball">Basketball</SelectItem>
            <SelectItem value="soccer">Soccer</SelectItem>
            <SelectItem value="volleyball">Volleyball</SelectItem>
            <SelectItem value="football">Football</SelectItem>
            <SelectItem value="baseball">Baseball</SelectItem>
          </SelectContent>
        </Select>
        <Button onClick={handleSearch} disabled={loading}>
          {loading ? 'Searching...' : 'Search'}
        </Button>
      </div>

      {events.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {events.map((event) => (
            <EventCard
              key={event.id}
              {...event}
              sport={event.sport_type}
              onDelete={(id) => setEvents((prev) => prev.filter((e) => e.id !== id))}
            />
          ))}
        </div>
      ) : (
        <p className="text-gray-500">No events found. Create your first event!</p>
      )}
    </main>
  );
}

