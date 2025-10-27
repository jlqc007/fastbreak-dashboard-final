'use client'

import { useRouter } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

export default function LogoutButton() {
  const router = useRouter()
  const supabase = createClientComponentClient()

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut()

    if (error) {
      toast.error(error.message)
    } else {
      toast.success('Logged out')
      router.push('/login')
    }
  }

  return (
    <Button variant="outline" onClick={handleLogout}>
      Logout
    </Button>
  )
}
