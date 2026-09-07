import { after } from 'next/server'
import { db, leads } from '@/app/lib/db'
import { sendWhatsApp } from '@/app/lib/notify/whatsapp'
import { sendLeadEmail } from '@/app/lib/notify/email'
import { getClientIP, rateLimit } from '@/app/lib/rate-limit'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'
// after() runs once the response is sent but still counts against the
// function's budget, so leave room for the database write plus two outbound
// calls without holding the user's request open.
export const maxDuration = 30

type LeadBody = {
  name?: string
  phone?: string
  email?: string
  detail?: string
  message?: string
  service?: string
  sourceUrl?: string
  hp?: string
}

function clean(s: unknown, max: number): string {
  return typeof s === 'string' ? s.trim().slice(0, max) : ''
}

/** Pull utm_* and gclid out of the page URL the form was submitted from. */
function utmFrom(sourceUrl: string): Record<string, string> | undefined {
  if (!sourceUrl) return undefined
  try {
    const params = new URL(sourceUrl).searchParams
    const out: Record<string, string> = {}
    for (const [k, v] of params) {
      if (k.startsWith('utm_') || k === 'gclid' || k === 'fbclid') out[k] = v.slice(0, 120)
    }
    return Object.keys(out).length ? out : undefined
  } catch {
    return undefined
  }
}

export async function POST(request: Request) {
  const ip = getClientIP(request)
  const limited = rateLimit(`lead:${ip}`, { max: 5, windowMs: 10 * 60 * 1000 })
  if (!limited.ok) {
    return Response.json({ error: 'Too many requests. Please try again in a few minutes.' }, { status: 429 })
  }

  let body: LeadBody
  try {
    body = (await request.json()) as LeadBody
  } catch {
    return Response.json({ error: 'Invalid request' }, { status: 400 })
  }

  // Honeypot: bots fill hidden fields. Pretend success so they stop retrying.
  if (clean(body.hp, 100)) return Response.json({ ok: true })

  const name = clean(body.name, 80)
  const phone = clean(body.phone, 15).replace(/\D/g, '')
  const email = clean(body.email, 160)
  const detail = clean(body.detail, 80)
  const message = clean(body.message, 1000)
  const service = clean(body.service, 80)
  const sourceUrl = clean(body.sourceUrl, 300)

  if (name.length < 2) return Response.json({ error: 'Please enter your name.' }, { status: 400 })
  if (!/^[6-9]\d{9}$/.test(phone)) {
    return Response.json({ error: 'Please enter a valid 10-digit mobile number.' }, { status: 400 })
  }

  // 1. Persist first. If the database is configured, a stored lead is the
  //    source of truth; notifications are best-effort on top of it.
  let leadId: string | undefined
  let stored = false
  if (db) {
    try {
      const [row] = await db
        .insert(leads)
        .values({
          name,
          phone,
          email: email || null,
          detail: detail || null,
          message: message || null,
          service: service || null,
          sourceUrl: sourceUrl || null,
          referrer: request.headers.get('referer'),
          utm: utmFrom(sourceUrl),
          ip,
          userAgent: request.headers.get('user-agent')?.slice(0, 300) ?? null,
        })
        .returning({ id: leads.id })
      leadId = row?.id
      stored = true
    } catch (err) {
      // Never fail the visitor's submission because the database is down.
      // The log line below is then the only record, so keep it complete.
      console.error('[lead] db insert failed:', err)
    }
  }

  // Always log. This is the fallback record when the database is unset or
  // unreachable. Contains no PAN, Aadhaar or document data.
  console.log('[lead]', JSON.stringify({ leadId, stored, name, phone, service, detail, sourceUrl, at: new Date().toISOString() }))

  // 2. Notify after the response so the visitor is not waiting on WhatsApp
  //    or email round-trips.
  after(async () => {
    const waText = [
      'New lead on the website',
      `Name: ${name}`,
      `Phone: +91${phone}`,
      service ? `Service: ${service}` : '',
      detail ? `Detail: ${detail}` : '',
      message ? `Message: ${message}` : '',
      `Reply: https://wa.me/91${phone}`,
    ]
      .filter(Boolean)
      .join('\n')

    const [wa, mail] = await Promise.all([
      sendWhatsApp({
        // Template body order: name, phone, service, detail.
        templateParams: [name, `+91${phone}`, service || 'General enquiry', detail || '-'],
        text: waText,
      }),
      sendLeadEmail({ name, phone, service, detail, message, sourceUrl, leadId }),
    ])

    if (!wa.sent) console.warn('[lead] whatsapp not sent:', wa.reason)
    if (!mail.sent) console.warn('[lead] email not sent:', mail.reason)

    // Record that someone was actually told, so an unnotified lead is visible
    // in the inbox rather than silently sitting there.
    if (db && leadId && (wa.sent || mail.sent)) {
      try {
        const { sql } = await import('drizzle-orm')
        await db
          .update(leads)
          .set({ notifiedCount: sql`${leads.notifiedCount} + 1`, updatedAt: new Date() })
          .where(sql`${leads.id} = ${leadId}`)
      } catch (err) {
        console.error('[lead] notified_count update failed:', err)
      }
    }
  })

  return Response.json({ ok: true })
}
