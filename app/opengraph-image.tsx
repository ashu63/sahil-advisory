import { SITE } from '@/app/lib/site'
import { SERVICES } from '@/app/lib/services'
import { ogImage, OG_SIZE, OG_CONTENT_TYPE } from '@/app/lib/og'

export const size = OG_SIZE
export const contentType = OG_CONTENT_TYPE
export const alt = 'Sahil Advisory: expert ITR, GST and TDS filing at fixed prices'

export default async function Image() {
  return ogImage({
    eyebrow: 'Tax filing and compliance',
    title: 'Handled by experts. At prices you can see.',
    subtitle: SITE.shortDescription,
    chips: ['ITR from ₹999', 'GST from ₹999/mo', 'TDS returns', 'Notice replies'],
    stat: { label: 'Catalogue', value: String(SERVICES.length), sub: 'fixed-price plans' },
  })
}
