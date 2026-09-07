import { SITE, BASE_URL } from '@/app/lib/site'

export type EmailResult = { sent: true } | { sent: false; reason: string }

export async function sendLeadEmail(input: {
  name: string
  phone: string
  service?: string
  detail?: string
  message?: string
  sourceUrl?: string
  leadId?: string
}): Promise<EmailResult> {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) return { sent: false, reason: 'RESEND_API_KEY not set' }

  const to = process.env.LEADS_TO_EMAIL || SITE.email
  const from = process.env.LEADS_FROM_EMAIL || `leads@${new URL(BASE_URL).hostname}`
  const lines = [
    `Name: ${input.name}`,
    `Phone: ${input.phone}`,
    `Service: ${input.service || '-'}`,
    `Detail: ${input.detail || '-'}`,
    `Message: ${input.message || '-'}`,
    `Page: ${input.sourceUrl || '-'}`,
    input.leadId ? `Lead id: ${input.leadId}` : '',
    '',
    `Call: tel:+91${input.phone}`,
    `WhatsApp: https://wa.me/91${input.phone}`,
  ].filter(Boolean)

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: `${SITE.name} Leads <${from}>`,
        to: [to],
        replyTo: to,
        subject: `New callback request: ${input.name} (${input.service || input.detail || 'general'})`,
        text: lines.join('\n'),
      }),
      signal: AbortSignal.timeout(8000),
    })
    if (!res.ok) {
      const body = await res.text().catch(() => '')
      return { sent: false, reason: `resend responded ${res.status}: ${body.slice(0, 300)}` }
    }
    return { sent: true }
  } catch (err) {
    return { sent: false, reason: err instanceof Error ? err.message : String(err) }
  }
}
