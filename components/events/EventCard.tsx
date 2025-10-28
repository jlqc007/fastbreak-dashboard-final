"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Badge } from "@/components/ui/badge";
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
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
  const [dialogOpen, setDialogOpen] = useState(false)
  
  // Format date to MM/DD/YYYY HH:MM
  const formatDate = (d: string) => {
    try {
      const dt = new Date(d)
      if (isNaN(dt.getTime())) return d
      const yyyy = dt.getFullYear()
      const mm = String(dt.getMonth() + 1).padStart(2, '0')
      const dd = String(dt.getDate()).padStart(2, '0')
      const hh = String(dt.getHours()).padStart(2, '0')
      const min = String(dt.getMinutes()).padStart(2, '0')
      return `${mm}/${dd}/${yyyy} ${hh}:${min}`
    } catch (e) {
      return d
    }
  }
  
  const handleDelete = async () => {
    try {
      setLoading(true)
      const result = await deleteEvent(id)
      if (result?.error) throw new Error(result.error)
      toast.success('Event deleted')
      setDialogOpen(false)
      onDelete?.(id)
    } catch (err: any) {
      toast.error(err?.message || 'Delete failed')
    } finally {
      setLoading(false)
    }
  }
  return (
    <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-4 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">{name}</h3>
        <Badge variant="sport">{sport}</Badge>
      </div>
      
      <div className="space-y-2">
        <div>
          <p className="text-xs font-medium text-muted-foreground">Date & Time</p>
          <p className="text-sm">{formatDate(date)}</p>
        </div>
        
        <div>
          <p className="text-xs font-medium text-muted-foreground">Description</p>
          <p className="text-sm">{description || 'No description provided'}</p>
        </div>
        
        <div>
          <p className="text-xs font-medium text-muted-foreground">Venues</p>
          {venues && venues.length > 0 ? (
            <ul className="text-sm list-disc list-inside">
              {venues.map((v, i) => (
                <li key={i}>{v}</li>
              ))}
            </ul>
          ) : (
            <p className="text-sm">No venues listed</p>
          )}
        </div>
      </div>
      
      <div className="flex gap-2 mt-2 pt-2 border-t">
        <Button
          variant="outline"
          size="sm"
          onClick={() => (window.location.href = `/dashboard/edit/${id}`)}
          disabled={loading}
        >
          Edit
        </Button>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button
              size="sm"
              variant="outline"
              className="text-red-700 border-red-200 hover:bg-red-100"
              disabled={loading}
            >
              Delete
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete Event</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete "{name}"? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setDialogOpen(false)}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button
                className="bg-red-600 hover:bg-red-700 text-white"
                onClick={handleDelete}
                disabled={loading}
              >
                {loading ? 'Deleting...' : 'Delete'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default EventCard;
