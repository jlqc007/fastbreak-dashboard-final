// app/dashboard/page.tsx
import { getUserEvents } from '@/lib/queries/events'
import DashboardClient from './DashboardClient'

export default async function DashboardPage() {
  // ✅ server-side: safe to use Supabase, cookies, etc.
  const events = await getUserEvents()

  return <DashboardClient initialEvents={events} />
}
