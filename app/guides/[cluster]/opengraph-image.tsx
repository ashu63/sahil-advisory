import { CLUSTERS } from '@/app/lib/guides/types'
import { guidesIn } from '@/app/lib/guides'
import type { ClusterId } from '@/app/lib/guides/types'
import { ogImage, OG_SIZE, OG_CONTENT_TYPE } from '@/app/lib/og'

export const size = OG_SIZE
export const contentType = OG_CONTENT_TYPE
export const alt = 'Sahil Advisory guide cluster'

type Params = { cluster: string }

export function generateStaticParams(): Params[] {
  return CLUSTERS.map((c) => ({ cluster: c.id }))
}

export default async function Image({ params }: { params: Promise<Params> }) {
  const { cluster } = await params
  const c = CLUSTERS.find((x) => x.id === cluster)
  if (!c) return ogImage({ eyebrow: 'Guides', title: 'Tax guides in plain English' })

  const published = guidesIn(c.id as ClusterId)

  return ogImage({
    eyebrow: 'Guides',
    title: c.name,
    subtitle: c.description,
    stat: { label: 'In this cluster', value: String(published.length), sub: 'guides' },
  })
}
