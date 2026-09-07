// Serves the IndexNow key file. next.config.ts rewrites /<key>.txt here so
// the key never has to be committed to the public folder.
export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  const key = process.env.INDEXNOW_KEY
  const requested = new URL(request.url).searchParams.get('key')
  if (!key || requested !== key) return new Response('Not found', { status: 404 })
  return new Response(key, { headers: { 'Content-Type': 'text/plain', 'Cache-Control': 'public, max-age=86400' } })
}
