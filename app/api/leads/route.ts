import { SITE } from '@/app/lib/site'
import { getClientIP, rateLimit } from '@/app/lib/rate-limit'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

// Phase 0 lead capture. No database yet: the lead is emailed to ops via
// Resend (if configured) and always logged. Phase 1 writes to the `leads`
// table in Supabase and fires the WhatsApp template.

type LeadBody = {
  name?: string
  phone?: string
  detail?: string
  message?: string
  service?: string
  sourceUrl?: string
  hp?: string
}

function clean(s: unknown, max: number): string {
  return typeof s === 'string' ? s.trim().slice(0, max) : ''
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

  // Honeypot: bots fill hidden fields. Pretend success.
  if (clean(body.hp, 100)) return Response.json({ ok: true })

  const name = clean(body.name, 80)
  const phone = clean(body.phone, 15).replace(/\D/g, '')
  const detail = clean(body.detail, 80)
  const message = clean(body.message, 1000)
  const service = clean(body.service, 80)
  const sourceUrl = clean(body.sourceUrl, 300)

  if (name.length < 2) return Response.json({ error: 'Please enter your name.' }, { status: 400 })
  if (!/^[6-9]\d{9}$/.test(phone)) return Response.json({ error: 'Please enter a valid 10-digit mobile number.' }, { status: 400 })

  const lead = { name, phone, detail, message, service, sourceUrl, ip, at: new Date().toISOString() }
  // Never log PAN/Aadhaar; leads contain only name/phone so this is safe.
  console.log('[lead]', JSON.stringify(lead))

  const apiKey = process.env.RESEND_API_KEY
  const to = process.env.LEADS_TO_EMAIL || SITE.email
  const from = process.env.LEADS_FROM_EMAIL || `leads@${new URL(process.env.NEXT_PUBLIC_BASE_URL || 'https://sahiladvisory.in').hostname}`
  if (apiKey) {
    try {
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          from: `${SITE.name} Leads <${from}>`,
          to: [to],
          subject: `New callback request: ${name} (${service || detail || 'general'})`,
          text: [
            `Name: ${name}`,
            `Phone: ${phone}`,
            `Service: ${service || '-'}`,
            `Detail: ${detail || '-'}`,
            `Message: ${message || '-'}`,
            `Page: ${sourceUrl || '-'}`,
            `Time: ${lead.at}`,
            '',
            `WhatsApp: https://wa.me/91${phone}`,
          ].join('\n'),
        }),
      })
      if (!res.ok) console.error('[lead] resend failed', res.status, await res.text())
    } catch (err) {
      console.error('[lead] resend error', err)
    }
  }

  return Response.json({ ok: true })
}
