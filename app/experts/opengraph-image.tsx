import { publishedExperts } from '@/app/lib/experts'
import { ogImage, OG_SIZE, OG_CONTENT_TYPE } from '@/app/lib/og'

export const size = OG_SIZE
export const contentType = OG_CONTENT_TYPE
export const alt = 'The CMA and CA panel behind every Sahil Advisory filing'

export default async function Image() {
  return ogImage({
    eyebrow: 'Our panel',
    title: 'A named, qualified professional reviews every filing.',
    subtitle:
      'Cost and Management Accountants, Chartered Accountants and GST practitioners. Credentials, specialisations and languages listed for each.',
    chips: ['Credentials published', 'Draft before filing', 'English, Hindi, Punjabi'],
    stat: { label: 'On the panel', value: String(publishedExperts().length), sub: 'experts' },
  })
}
