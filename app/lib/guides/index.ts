// Guide registry. Each guide lives in ./content/<slug>.ts and is listed here.
// Adding a guide here automatically flows into generateStaticParams, the
// sitemap, the hub page, cluster pages, related-guide cards and IndexNow.
import type { Guide, ClusterId } from './types'
import { CLUSTERS } from './types'
import { GUIDE_LIST } from './content'

export const GUIDES: Guide[] = GUIDE_LIST

export function getGuide(cluster: string, slug: string) {
  return GUIDES.find((g) => g.cluster === cluster && g.slug === slug)
}
export function getGuideBySlug(slug: string) {
  return GUIDES.find((g) => g.slug === slug)
}
export function guidesIn(cluster: ClusterId) {
  return GUIDES.filter((g) => g.cluster === cluster)
}
export function guidePath(g: Pick<Guide, 'cluster' | 'slug'>) {
  return `/guides/${g.cluster}/${g.slug}`
}
export function clusterGaps() {
  return CLUSTERS.map((c) => ({ ...c, have: guidesIn(c.id).length }))
}
export { CLUSTERS }
