import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const origin = requestUrl.origin

  // Resolve cookies() and pass into the route handler client
  const cookieStore = await cookies()
  const supabase = createRouteHandlerClient({ cookies: () => cookieStore as any })

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: { redirectTo: `${origin}/auth/callback` },
  })

  if (error) {
    console.error('OAuth start error:', error.message)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  // data.url is the provider redirect URL
  return NextResponse.redirect(data.url)
}
