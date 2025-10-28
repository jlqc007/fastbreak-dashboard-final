// app/dashboard/layout.tsx
import { ReactNode } from 'react'
import LogoutButton from '@/components/auth/LogoutButton'
import { createServerComponentSupabaseClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  // Protect all dashboard routes server-side: redirect to /login if no session
  const supabase = await createServerComponentSupabaseClient()
  const { data: sessionData } = await supabase.auth.getSession()
  const user = sessionData.session?.user

  if (!user) {
    return redirect('/login')
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header className="flex items-center justify-between px-6 py-4 border-b">
        <h1 className="text-xl font-semibold">Dashboard</h1>
        <LogoutButton />
      </header>
      <main className="flex-1 p-6">{children}</main>
    </div>
  )
}
