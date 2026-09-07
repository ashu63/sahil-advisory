import { ogImage, OG_SIZE, OG_CONTENT_TYPE } from '@/app/lib/og'

export const size = OG_SIZE
export const contentType = OG_CONTENT_TYPE
export const alt = 'Sahil Advisory disclaimer'

export default async function Image() {
  return ogImage({
    eyebrow: 'Policy',
    title: 'Disclaimer',
    subtitle:
      'Our content and calculators are general information, not professional advice. How the panel works, who performs audits, and the limits on what we say.',
    chips: ['General information only', 'Audits signed by empanelled CAs'],
    footnote: 'Last updated 6 September 2026',
  })
}
