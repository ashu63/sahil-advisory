import { ogImage, OG_SIZE, OG_CONTENT_TYPE } from '@/app/lib/og'

export const size = OG_SIZE
export const contentType = OG_CONTENT_TYPE
export const alt = 'Sahil Advisory privacy policy'

export default async function Image() {
  return ogImage({
    eyebrow: 'Policy',
    title: 'Privacy Policy',
    subtitle:
      'How we collect, use, store and delete your personal and financial data under the DPDP Act 2023, including your rights and grievance contact.',
    chips: ['DPDP Act 2023', 'Deletion on request'],
    footnote: 'Last updated 6 September 2026',
  })
}
