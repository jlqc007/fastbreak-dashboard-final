import { NextResponse } from 'next/server'
import { createServerActionSupabaseClient } from '@/lib/supabase/server'

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
  const supabase = await createServerActionSupabaseClient()
    const { error } = await supabase.from('events').delete().eq('id', params.id)
    if (error) {
      console.error('Failed to delete event:', error.message)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (err: any) {
    console.error('Error in DELETE /api/events/[id]:', err)
    return NextResponse.json({ error: err?.message || 'Server error' }, { status: 500 })
  }
}
