import { ogImage, OG_SIZE, OG_CONTENT_TYPE } from '@/app/lib/og'

export const size = OG_SIZE
export const contentType = OG_CONTENT_TYPE
export const alt = 'Sahil Advisory cancellation policy'

export default async function Image() {
  return ogImage({
    eyebrow: 'Policy',
    title: 'Cancellation Policy',
    subtitle:
      'How to cancel or reschedule an order, consultation or monthly GST retainer, the cutoff times that apply, and what happens to your documents.',
    chips: ['Cutoff times', 'Document handling'],
    footnote: 'Last updated 6 September 2026',
  })
}
