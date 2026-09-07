import { GUIDES, getGuide } from '@/app/lib/guides'
import { CLUSTERS } from '@/app/lib/guides/types'
import { formatDateIN } from '@/app/lib/format'
import { ogImage, OG_SIZE, OG_CONTENT_TYPE } from '@/app/lib/og'

export const size = OG_SIZE
export const contentType = OG_CONTENT_TYPE
export const alt = 'Sahil Advisory tax guide'

type Params = { cluster: string; slug: string }

export function generateStaticParams(): Params[] {
  return GUIDES.map((g) => ({ cluster: g.cluster, slug: g.slug }))
}

export default async function Image({ params }: { params: Promise<Params> }) {
  const { cluster, slug } = await params
  const g = getGuide(cluster, slug)
  if (!g) return ogImage({ eyebrow: 'Guides', title: 'Tax guides in plain English' })

  const clusterName = CLUSTERS.find((c) => c.id === g.cluster)?.name ?? 'Guides'

  return ogImage({
    eyebrow: clusterName,
    title: g.title,
    subtitle: g.excerpt,
    chips: [`Updated ${formatDateIN(g.dateModified)}`],
    stat: { label: 'Read', value: `${g.readMinutes} min` },
  })
}
