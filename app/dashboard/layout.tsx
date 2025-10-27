// app/dashboard/layout.tsx
import { ReactNode } from 'react'
import LogoutButton from '@/components/auth/LogoutButton'

export default function DashboardLayout({ children }: { children: ReactNode }) {
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
