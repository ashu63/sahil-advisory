// One call, every destination. Import `track` from client components only.
//
// Events are named as things a person did, in snake_case, with a small set
// of properties that answer "which page, which plan, which button". Keep the
// vocabulary here so the PostHog funnel and the GA4 conversion list stay in
// sync with what the code actually sends.

export type AnalyticsEvent =
  | 'lead_submitted' // the callback form was accepted by the API
  | 'lead_failed' // the API rejected it (validation, rate limit)
  | 'whatsapp_click' // any wa.me link
  | 'call_click' // any tel: link
  | 'plan_view' // a service SKU page loaded
  | 'plan_cta_click' // "Get started" on a plan card or SKU page
  | 'consult_click' // a "Book" button on the consultation page
  | 'calculator_used' // first input change on a calculator, once per load
  | 'calculator_cta_click' // the CTA below a calculator result
  | 'pricing_view'
  | 'guide_read' // reached the FAQ block of a guide (scroll depth proxy)

export type AnalyticsProps = Record<string, string | number | boolean | null | undefined>

type Gtag = (...args: unknown[]) => void

// GA4 treats these as conversions once marked in the GA4 admin. Listed here
// so the names never drift.
export const GA4_CONVERSIONS: AnalyticsEvent[] = ['lead_submitted', 'whatsapp_click', 'call_click', 'plan_cta_click', 'consult_click']

export function track(event: AnalyticsEvent, props: AnalyticsProps = {}) {
  if (typeof window === 'undefined') return
  const clean: AnalyticsProps = {}
  for (const [k, v] of Object.entries(props)) if (v !== undefined && v !== null && v !== '') clean[k] = v
  clean.path = clean.path ?? window.location.pathname

  try {
    // Dynamic import keeps posthog-js out of every page's initial bundle; it
    // is already loaded by instrumentation-client when a key is configured.
    void import('posthog-js').then(({ default: posthog }) => {
      if (posthog.__loaded) posthog.capture(event, clean)
    })
  } catch {}

  try {
    const gtag = (window as unknown as { gtag?: Gtag }).gtag
    gtag?.('event', event, clean)
  } catch {}

  try {
    const clarity = (window as unknown as { clarity?: (...a: unknown[]) => void }).clarity
    // Clarity "custom tags" let you filter recordings by what the visitor did.
    if (clarity && (event === 'lead_submitted' || event === 'whatsapp_click')) clarity('set', event, 'true')
  } catch {}
}

// Call after a lead converts so PostHog can stitch the anonymous session to a
// person. The lead id is stable and non-personal, which is what PostHog asks
// for; never pass the phone number.
export function identifyLead(leadId: string, props: AnalyticsProps = {}) {
  if (typeof window === 'undefined') return
  try {
    void import('posthog-js').then(({ default: posthog }) => {
      if (posthog.__loaded) posthog.identify(`lead:${leadId}`, props)
    })
  } catch {}
}
