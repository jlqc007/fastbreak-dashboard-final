'use client'

import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { createEvent } from '@/lib/actions/create-event'
import { updateEvent } from '@/lib/actions/update-event'

const formSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, 'Event name is required'),
  sport_type: z.string().min(1, 'Sport type is required'),
  date: z.string().min(1, 'Date and time is required'),
  description: z.string().min(1, 'Description is required'),
  venues: z.string().min(1, 'At least one venue is required'),
})

export type EventFormData = z.infer<typeof formSchema>

export default function EventForm({ initialValues }: { initialValues?: EventFormData }) {
  const router = useRouter()

  const form = useForm<EventFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: initialValues || {
      name: '',
      sport_type: '',
      date: '',
      description: '',
      venues: '',
    },
  })

  const onSubmit = async (values: EventFormData) => {
    const formData = new FormData()
    Object.entries(values).forEach(([key, value]) => {
      if (key === 'venues') {
        value.split(',').map(v => formData.append('venues', v.trim()))
      } else {
        formData.append(key, value)
      }
    })

    const result = values.id
      ? await updateEvent(values.id, formData)
      : await createEvent(formData)

    if (result?.error) {
      toast.error(result.error)
    } else {
      toast.success(values.id ? 'Event updated!' : 'Event created!')
      router.push('/dashboard')
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Event Name</FormLabel>
              <FormControl>
                <Input placeholder="Championship Game" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="sport_type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Sport Type</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a sport" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="basketball">Basketball</SelectItem>
                  <SelectItem value="soccer">Soccer</SelectItem>
                  <SelectItem value="volleyball">Volleyball</SelectItem>
                  <SelectItem value="football">Football</SelectItem>
                  <SelectItem value="baseball">Baseball</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Date & Time</FormLabel>
              <FormControl>
                <Input type="datetime-local" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description *</FormLabel>
              <FormControl>
                <Textarea placeholder="Event details..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="venues"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Venues (comma-separated)</FormLabel>
              <FormControl>
                <Input placeholder="Stadium 1, Field A, Court 3" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full">
          {initialValues?.id ? 'Update Event' : 'Create Event'}
        </Button>
      </form>
    </Form>
  )
}
