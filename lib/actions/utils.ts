// lib/actions/utils.ts
export type ActionResult<T = unknown> = { success?: T; error?: string }

export async function withAction<T>(fn: () => Promise<T>): Promise<ActionResult<T>> {
  try {
    const res = await fn()
    return { success: res }
  } catch (err: any) {
    return { error: err?.message || String(err) }
  }
}
