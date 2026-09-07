import { ogImage, OG_SIZE, OG_CONTENT_TYPE } from '@/app/lib/og'

export const size = OG_SIZE
export const contentType = OG_CONTENT_TYPE
export const alt = 'How Sahil Advisory secures and handles your tax documents'

export default async function Image() {
  return ogImage({
    eyebrow: 'Security and privacy',
    title: 'Your documents, handled like they matter.',
    subtitle:
      'How we store, transmit and delete the PAN, Form 16, bank statements and books you share with us, and what we never do with them.',
    chips: ['Encrypted in transit and at rest', 'Deletion on request', 'Never sold or shared'],
  })
}
