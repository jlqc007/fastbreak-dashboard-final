'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
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
  const supabase = createClientComponentClient()
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    setLoading(true)

    const method = isLogin ? 'signInWithPassword' : 'signUp'
    const { error } = await supabase.auth[method]({
      email: data.email,
      password: data.password,
    } as any)

    if (error) {
      toast.error(error.message)
    } else {
      toast.success(isLogin ? 'Logged in!' : 'Signed up!')
      router.push('/dashboard')
    }

    setLoading(false)
  }

  const handleOAuth = async () => {
    setLoading(true)
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${location.origin}/auth/callback`,
      },
    })

    if (error) {
      toast.error(error.message)
    }

    setLoading(false)
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
