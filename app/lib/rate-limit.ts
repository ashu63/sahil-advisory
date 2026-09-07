// In-memory sliding-window limiter. Good enough for a single Vercel function
// instance in Phase 0; swap for Upstash/Postgres when traffic grows.

const buckets = new Map<string, number[]>()

export function rateLimit(key: string, opts: { max: number; windowMs: number }): { ok: boolean; remaining: number } {
  const now = Date.now()
  const arr = (buckets.get(key) ?? []).filter((t) => now - t < opts.windowMs)
  if (arr.length >= opts.max) {
    buckets.set(key, arr)
    return { ok: false, remaining: 0 }
  }
  arr.push(now)
  buckets.set(key, arr)
  if (buckets.size > 5000) {
    for (const [k, v] of buckets) if (!v.some((t) => now - t < opts.windowMs)) buckets.delete(k)
  }
  return { ok: true, remaining: opts.max - arr.length }
}

export function getClientIP(request: Request): string {
  const h = request.headers
  return (
    h.get('x-real-ip') ||
    h.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    h.get('cf-connecting-ip') ||
    'unknown'
  )
}
