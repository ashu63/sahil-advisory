import { ogImage, OG_SIZE, OG_CONTENT_TYPE } from '@/app/lib/og'

export const size = OG_SIZE
export const contentType = OG_CONTENT_TYPE
export const alt = 'Sahil Advisory terms of service'

export default async function Image() {
  return ogImage({
    eyebrow: 'Policy',
    title: 'Terms of Service',
    subtitle:
      'Terms governing tax filing, GST, TDS and consultation services: scope, your responsibilities, fees, liability limits and jurisdiction.',
    chips: ['Scope and fees', 'Liability limits'],
    footnote: 'Last updated 6 September 2026',
  })
}
