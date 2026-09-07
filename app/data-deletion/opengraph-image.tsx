import { ogImage, OG_SIZE, OG_CONTENT_TYPE } from '@/app/lib/og'

export const size = OG_SIZE
export const contentType = OG_CONTENT_TYPE
export const alt = 'Request deletion of your Sahil Advisory data'

export default async function Image() {
  return ogImage({
    eyebrow: 'Policy',
    title: 'Data Deletion Request',
    subtitle:
      'Request deletion of your account and uploaded documents: how we verify identity, what is erased within 30 days, and what we must retain by law.',
    chips: ['Erased within 30 days', 'Identity verified first'],
    footnote: 'Last updated 6 September 2026',
  })
}
