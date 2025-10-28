"use server"

import { createServerActionSupabaseClient } from '@/lib/supabase/server'
import { withAction, ActionResult } from './utils'

export async function signInAction(email: string, password: string): Promise<ActionResult<boolean>> {
  return await withAction(async () => {
  const supabase = await createServerActionSupabaseClient()
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw new Error(error.message)
    return true
  })
}

export async function signUpAction(email: string, password: string): Promise<ActionResult<boolean>> {
  return await withAction(async () => {
  const supabase = await createServerActionSupabaseClient()
    const { error } = await supabase.auth.signUp({ email, password })
    if (error) throw new Error(error.message)

    // attempt immediate sign in
    const { error: signinError } = await supabase.auth.signInWithPassword({ email, password })
    if (signinError) throw new Error(signinError.message)

    return true
  })
}

export async function signOutAction(): Promise<ActionResult<boolean>> {
  return await withAction(async () => {
  const supabase = await createServerActionSupabaseClient()
    const { error } = await supabase.auth.signOut()
    if (error) throw new Error(error.message)
    return true
  })
}
