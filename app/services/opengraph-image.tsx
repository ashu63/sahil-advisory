import { CATEGORIES, SERVICES } from '@/app/lib/services'
import { ogImage, OG_SIZE, OG_CONTENT_TYPE } from '@/app/lib/og'

export const size = OG_SIZE
export const contentType = OG_CONTENT_TYPE
export const alt = 'Sahil Advisory services: ITR, GST, TDS, registrations, notices and audit'

export default async function Image() {
  return ogImage({
    eyebrow: 'Services',
    title: 'Every filing your business needs, at a price you can see.',
    subtitle:
      'Six categories, from a single salaried ITR to monthly GST, TDS returns, registrations, notice replies and audit.',
    chips: CATEGORIES.slice(0, 4).map((c) => c.navLabel),
    stat: { label: 'Catalogue', value: String(SERVICES.length), sub: 'fixed-price plans' },
  })
}
