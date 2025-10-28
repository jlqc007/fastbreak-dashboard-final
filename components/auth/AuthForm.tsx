 'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { signInAction, signUpAction } from '@/lib/actions/auth'
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
import { toast } from 'sonner'

const formSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
})

export default function AuthForm() {
  const [isLogin, setIsLogin] = useState(true)
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      setLoading(true)

      if (isLogin) {
        const res = await signInAction(data.email, data.password)
        if (res.error) throw new Error(res.error)
      } else {
        const res = await signUpAction(data.email, data.password)
        if (res.error) throw new Error(res.error)
      }

  toast.success(isLogin ? 'Logged in!' : 'Account created successfully!')
  // Use a full navigation so any Set-Cookie from the server action is
  // applied before the dashboard server components read cookies.
  window.location.href = '/dashboard'
    } catch (error: any) {
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleOAuth = async () => {
    // Start OAuth flow via server route which uses the server Supabase helper
    setLoading(true)
    try {
      // simply navigate to the server route which will redirect to Google
      window.location.href = '/api/auth/google'
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-bold text-center">
        {isLogin ? 'Login' : 'Sign Up'}
      </h1>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="you@example.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="••••••••" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Please wait...' : isLogin ? 'Login' : 'Sign Up'}
          </Button>
        </form>
      </Form>

      <Button
        variant="outline"
        className="w-full"
        onClick={handleOAuth}
        disabled={loading}
      >
        {loading ? 'Loading...' : 'Continue with Google'}
      </Button>

      <p className="text-sm text-center">
        {isLogin ? "Don't have an account?" : 'Already have an account?'}{' '}
        <button
          type="button"
          onClick={() => setIsLogin(!isLogin)}
          className="underline font-medium"
        >
          {isLogin ? 'Sign up' : 'Log in'}
        </button>
      </p>
    </div>
  )
}
