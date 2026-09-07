import { CLUSTERS } from '@/app/lib/guides/types'
import { GUIDES } from '@/app/lib/guides'
import { ogImage, OG_SIZE, OG_CONTENT_TYPE } from '@/app/lib/og'

export const size = OG_SIZE
export const contentType = OG_CONTENT_TYPE
export const alt = 'Sahil Advisory tax guides in plain English'

export default async function Image() {
  return ogImage({
    eyebrow: 'Guides',
    title: 'Tax rules in plain English, written by practitioners.',
    subtitle:
      'ITR, GST, TDS, capital gains, notices and the Income-tax Act 2025, explained without the jargon and kept current.',
    chips: CLUSTERS.slice(0, 4).map((c) => c.name),
    stat: { label: 'Published', value: String(GUIDES.length), sub: 'guides' },
  })
}
