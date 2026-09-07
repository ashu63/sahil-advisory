import { CONSULTATIONS } from '@/app/lib/services'
import { formatINR } from '@/app/lib/format'
import { ogImage, OG_SIZE, OG_CONTENT_TYPE } from '@/app/lib/og'

export const size = OG_SIZE
export const contentType = OG_CONTENT_TYPE
export const alt = 'Book a tax consultation with a qualified professional (CMA/CA)'

export default async function Image() {
  const prices = CONSULTATIONS.map((c) => c.price)
  const from = prices.length > 0 ? Math.min(...prices) : null

  return ogImage({
    eyebrow: 'Consultation',
    title: 'Talk it through with a qualified professional.',
    subtitle:
      'Video or phone consultations on tax planning, notices, business structuring and GST. Written summary after every call, fee adjustable against services.',
    chips: ['Video or phone', 'Written summary', 'Fee adjustable'],
    stat: from ? { label: '30-minute call', value: formatINR(from) } : undefined,
  })
}
