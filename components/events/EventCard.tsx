"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Badge } from "@/components/ui/badge";
import { Button } from '@/components/ui/button'
import { deleteEvent } from '@/lib/actions/delete-event'

export type EventCardProps = {
  id: string;
  name: string;
  date: string;
  venue?: string;
  sport?: string;
  description?: string | null;
  venues?: string[] | null;
  onDelete?: (id: string) => void;
};

const EventCard = ({ id, name, date, venue, sport, description, venues, onDelete }: EventCardProps) => {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  // Format date to YYYY/MM/DD HH:MM
  const formatDate = (d: string) => {
    try {
      const dt = new Date(d)
      if (isNaN(dt.getTime())) return d
      const yyyy = dt.getFullYear()
      const mm = String(dt.getMonth() + 1).padStart(2, '0')
      const dd = String(dt.getDate()).padStart(2, '0')
      const hh = String(dt.getHours()).padStart(2, '0')
      const min = String(dt.getMinutes()).padStart(2, '0')
      return `${yyyy}/${mm}/${dd} ${hh}:${min}`
    } catch (e) {
      return d
    }
  }
  return (
    <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-4 flex flex-col justify-between gap-2">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">{name}</h3>
        <Badge variant="sport">{sport}</Badge>
      </div>
      <p className="text-sm text-muted-foreground">{formatDate(date)}</p>
      {venue ? <p className="text-sm">{venue}</p> : null}
      {description ? <p className="text-sm text-muted-foreground mt-2">{description}</p> : null}
      {venues && venues.length > 0 ? (
        <div className="mt-2">
          <h4 className="text-sm font-medium">Venues</h4>
          <ul className="text-sm list-disc list-inside">
            {venues.map((v, i) => (
              <li key={i}>{v}</li>
            ))}
          </ul>
        </div>
      ) : null}
      <div className="flex gap-2 mt-3">
        <Button
          variant="outline"
          size="sm"
          onClick={() => (window.location.href = `/dashboard/edit/${id}`)}
          disabled={loading}
        >
          Edit
        </Button>
        <Button
          size="sm"
          variant="outline"
          className="text-red-700 border-red-200 hover:bg-red-100"
          onClick={async () => {
            if (!confirm('Delete this event?')) return
            try {
              setLoading(true)
              const result = await deleteEvent(id)
              if (result?.error) throw new Error(result.error)
              toast.success('Event deleted')
              onDelete?.(id)
            } catch (err: any) {
              toast.error(err?.message || 'Delete failed')
            } finally {
              setLoading(false)
            }
          }}
          disabled={loading}
        >
          {loading ? 'Deleting...' : 'Delete'}
        </Button>
      </div>
    </div>
  );
};

export default EventCard;
