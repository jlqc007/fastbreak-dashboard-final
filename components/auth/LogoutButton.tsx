'use client'

import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { signOutAction } from '@/lib/actions/auth'

export default function LogoutButton() {
  const router = useRouter()

  const handleLogout = async () => {
    const res = await signOutAction()
    if (res.error) {
      toast.error(res.error)
    } else {
      toast.success('Logged out')
      // Perform a full navigation so the browser applies any Set-Cookie
      // changes produced by the server action before subsequent server
      // requests.
      window.location.href = '/login'
    }
  }

  return (
    <Button variant="outline" onClick={handleLogout}>
      Logout
    </Button>
  )
}
