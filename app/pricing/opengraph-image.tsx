import { SERVICES, CONSULTATIONS } from '@/app/lib/services'
import { formatINR } from '@/app/lib/format'
import { ogImage, OG_SIZE, OG_CONTENT_TYPE } from '@/app/lib/og'

export const size = OG_SIZE
export const contentType = OG_CONTENT_TYPE
export const alt = 'Sahil Advisory pricing: every ITR, GST, TDS and registration fee published'

export default async function Image() {
  const priced = SERVICES.map((s) => s.price).filter((p): p is number => p !== null)
  const from = priced.length > 0 ? Math.min(...priced) : null

  return ogImage({
    eyebrow: 'Pricing',
    title: 'Every fee published. No hidden charges.',
    subtitle:
      'ITR, GST, TDS, registrations, notices and audit, all priced on one page. Prices are ex-GST and what you pay is what you see.',
    chips: [
      `${SERVICES.length} service plans`,
      `${CONSULTATIONS.length} consultation options`,
      'Ex-GST, no hidden fees',
    ],
    stat: from ? { label: 'Starting at', value: formatINR(from) } : undefined,
  })
}
