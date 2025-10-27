'use client'

import { useState, useTransition } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useRouter, useSearchParams } from 'next/navigation'
import { getUserEvents } from '@/lib/queries/events'
import { useEffect, useState as useClientState } from 'react'
import EventCard from '@/components/events/EventCard'

type Event = {
  id: string;
  name: string;
  date: string;
  sport_type: string;
  [key: string]: any;
}

export default function DashboardPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [search, setSearch] = useClientState(searchParams.get('search') || '')
  const [sportFilter, setSportFilter] = useClientState(searchParams.get('sport') || '')
  const [events, setEvents] = useClientState<Event[]>([])
  const [isPending, startTransition] = useTransition()

  useEffect(() => {
    async function loadEvents() {
      const data = await getUserEvents(search, sportFilter)
      setEvents(data)
    }

    loadEvents()
  }, [search, sportFilter])

  const handleFilter = () => {
    const params = new URLSearchParams()
    if (search) params.set('search', search)
    if (sportFilter) params.set('sport', sportFilter)

    startTransition(() => {
      router.push(`/dashboard?${params.toString()}`)
    })
  }

  return (
    <div className="max-w-5xl mx-auto px-4">
      <h1 className="text-2xl font-bold mb-6">🏀 Fastbreak AI Events</h1>

      {/* Filter UI */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6">
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
      </div>

      {/* Events List */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {events.length === 0 ? (
          <p className="text-muted-foreground">No events found.</p>
        ) : (
          events.map((event) => <EventCard
                                  key={event.id}
                                  id={event.id}
                                  name={event.name}
                                  date={event.date}
                                  venue={event.venue}
                                  sport={event.sport}
                                />)
        )}
      </div>
    </div>
  )
}
