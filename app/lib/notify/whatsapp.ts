// WhatsApp notifications to the team.
//
// Two providers are supported so you are not blocked on one vendor's
// onboarding. Pick with WHATSAPP_PROVIDER:
//
//   'meta'    Official WhatsApp Cloud API. Business-initiated messages must
//             use an approved template, so this path sends a template with
//             positional body parameters.
//   'webhook' POST the payload to any URL: a BSP such as AiSensy or Interakt,
//             or an automation (Zapier, Make, n8n) that forwards to WhatsApp.
//
// Unset means "no WhatsApp configured": we log and move on rather than fail
// the request. A lead must never be lost because a notification hop is down.

export type WhatsAppResult =
  | { sent: true; provider: string }
  | { sent: false; reason: string }

type Params = {
  /** Ordered values substituted into the template body ({{1}}, {{2}}, ...). */
  templateParams: string[]
  /** Plain-text fallback used by the webhook provider. */
  text: string
}

const TIMEOUT_MS = 8000

async function postJson(url: string, body: unknown, headers: Record<string, string>) {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS)
  try {
    return await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...headers },
      body: JSON.stringify(body),
      signal: controller.signal,
    })
  } finally {
    clearTimeout(timer)
  }
}

async function sendViaMeta(params: Params): Promise<WhatsAppResult> {
  const token = process.env.WHATSAPP_TOKEN
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID
  const to = process.env.WHATSAPP_NOTIFY_TO
  const template = process.env.WHATSAPP_TEMPLATE_NAME
  const lang = process.env.WHATSAPP_TEMPLATE_LANG || 'en'
  if (!token || !phoneNumberId || !to || !template) {
    return { sent: false, reason: 'meta provider selected but WHATSAPP_TOKEN, WHATSAPP_PHONE_NUMBER_ID, WHATSAPP_NOTIFY_TO or WHATSAPP_TEMPLATE_NAME is missing' }
  }
  const res = await postJson(
    `https://graph.facebook.com/v21.0/${phoneNumberId}/messages`,
    {
      messaging_product: 'whatsapp',
      to,
      type: 'template',
      template: {
        name: template,
        language: { code: lang },
        components: [
          {
            type: 'body',
            parameters: params.templateParams.map((text) => ({ type: 'text', text })),
          },
        ],
      },
    },
    { Authorization: `Bearer ${token}` }
  )
  if (!res.ok) {
    const body = await res.text().catch(() => '')
    return { sent: false, reason: `meta responded ${res.status}: ${body.slice(0, 300)}` }
  }
  return { sent: true, provider: 'meta' }
}

async function sendViaWebhook(params: Params): Promise<WhatsAppResult> {
  const url = process.env.WHATSAPP_WEBHOOK_URL
  if (!url) return { sent: false, reason: 'webhook provider selected but WHATSAPP_WEBHOOK_URL is missing' }
  const headers: Record<string, string> = {}
  if (process.env.WHATSAPP_WEBHOOK_TOKEN) {
    headers.Authorization = `Bearer ${process.env.WHATSAPP_WEBHOOK_TOKEN}`
  }
  const res = await postJson(
    url,
    {
      to: process.env.WHATSAPP_NOTIFY_TO,
      text: params.text,
      params: params.templateParams,
    },
    headers
  )
  if (!res.ok) {
    const body = await res.text().catch(() => '')
    return { sent: false, reason: `webhook responded ${res.status}: ${body.slice(0, 300)}` }
  }
  return { sent: true, provider: 'webhook' }
}

export async function sendWhatsApp(params: Params): Promise<WhatsAppResult> {
  const provider = (process.env.WHATSAPP_PROVIDER || '').toLowerCase()
  if (!provider) return { sent: false, reason: 'WHATSAPP_PROVIDER not set' }
  try {
    if (provider === 'meta') return await sendViaMeta(params)
    if (provider === 'webhook') return await sendViaWebhook(params)
    return { sent: false, reason: `unknown WHATSAPP_PROVIDER "${provider}"` }
  } catch (err) {
    const reason = err instanceof Error ? err.message : String(err)
    return { sent: false, reason: `whatsapp request failed: ${reason}` }
  }
}
