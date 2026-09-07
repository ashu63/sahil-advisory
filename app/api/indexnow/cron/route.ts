import { BASE_URL } from '@/app/lib/site'
import { CATEGORIES, CATEGORY_PATH, SERVICES, servicePath } from '@/app/lib/services'
import { LIVE_CALCULATORS } from '@/app/lib/calculators'
import { DEADLINES } from '@/app/lib/due-dates'
import { GUIDES, guidePath } from '@/app/lib/guides'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'
export const maxDuration = 60

// Daily IndexNow push of priority URLs (Vercel cron in vercel.json). The key
// file lives at public/<INDEXNOW_KEY>.txt; keep both in sync.
const INDEXNOW_KEY = process.env.INDEXNOW_KEY || ''
const HOST = BASE_URL.replace(/^https?:\/\//, '')

function buildPriorityUrls(): string[] {
  const statics = ['/', '/services', '/pricing', '/consult', '/calculators', '/guides', '/due-dates', '/experts']
  const categories = CATEGORIES.map((c) => CATEGORY_PATH[c.id])
  const skus = SERVICES.map((s) => servicePath(s))
  const calcs = LIVE_CALCULATORS.map((c) => `/calculators/${c.slug}`)
  const dues = DEADLINES.map((d) => `/due-dates/${d.slug}`)
  const guides = GUIDES.map((g) => guidePath(g))
  return [...statics, ...categories, ...skus, ...calcs, ...dues, ...guides].map((p) => `${BASE_URL}${p}`)
}

export async function GET(request: Request) {
  const auth = request.headers.get('authorization')
  const cronSecret = process.env.CRON_SECRET
  if (!cronSecret) return Response.json({ error: 'CRON_SECRET not configured' }, { status: 500 })
  if (auth !== `Bearer ${cronSecret}`) return Response.json({ error: 'Unauthorized' }, { status: 401 })
  if (!INDEXNOW_KEY) return Response.json({ error: 'INDEXNOW_KEY not configured' }, { status: 500 })

  const urlList = buildPriorityUrls()
  try {
    const res = await fetch('https://api.indexnow.org/IndexNow', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
      body: JSON.stringify({ host: HOST, key: INDEXNOW_KEY, keyLocation: `${BASE_URL}/${INDEXNOW_KEY}.txt`, urlList }),
    })
    const result = { submittedAt: new Date().toISOString(), urlCount: urlList.length, indexNowStatus: res.status, indexNowOk: res.ok }
    console.log('[IndexNow Cron]', JSON.stringify(result))
    return Response.json(result)
  } catch (err) {
    console.error('[IndexNow Cron] failed:', err)
    return Response.json({ error: (err as Error).message }, { status: 500 })
  }
}
