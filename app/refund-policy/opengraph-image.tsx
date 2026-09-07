import { ogImage, OG_SIZE, OG_CONTENT_TYPE } from '@/app/lib/og'

export const size = OG_SIZE
export const contentType = OG_CONTENT_TYPE
export const alt = 'Sahil Advisory refund policy'

export default async function Image() {
  return ogImage({
    eyebrow: 'Policy',
    title: 'Refund Policy',
    subtitle:
      'When we refund a service or consultation fee, how much you get back at each stage of the work, what is never refundable and how long refunds take.',
    chips: ['Staged refunds', 'Timelines published'],
    footnote: 'Last updated 6 September 2026',
  })
}
