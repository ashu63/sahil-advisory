import type { MetadataRoute } from 'next'
import { BASE_URL } from './lib/site'
import { CATEGORIES, CATEGORY_PATH, SERVICES, servicePath } from './lib/services'
import { LIVE_CALCULATORS } from './lib/calculators'
import { DEADLINES } from './lib/due-dates'
import { GUIDES, CLUSTERS, guidesIn, guidePath } from './lib/guides'
import { publishedExperts } from './lib/experts'

// Honest lastmod policy: evergreen pages carry a static date bumped only on
// real edits; guides use their own dateModified; due-date pages use their
// lastVerified stamp. Restamping everything per deploy makes Google ignore
// lastmod for the whole site.
const STATIC_DATE = new Date('2026-09-06')

export default function sitemap(): MetadataRoute.Sitemap {
  const u = (p: string) => `${BASE_URL}${p}`

  const statics: MetadataRoute.Sitemap = [
    { url: u(''), lastModified: STATIC_DATE, changeFrequency: 'weekly', priority: 1 },
    { url: u('/services'), lastModified: STATIC_DATE, changeFrequency: 'weekly', priority: 0.9 },
    { url: u('/pricing'), lastModified: STATIC_DATE, changeFrequency: 'weekly', priority: 0.9 },
    { url: u('/consult'), lastModified: STATIC_DATE, changeFrequency: 'monthly', priority: 0.8 },
    { url: u('/calculators'), lastModified: STATIC_DATE, changeFrequency: 'monthly', priority: 0.8 },
    { url: u('/guides'), lastModified: STATIC_DATE, changeFrequency: 'weekly', priority: 0.8 },
    { url: u('/due-dates'), lastModified: STATIC_DATE, changeFrequency: 'weekly', priority: 0.8 },
    { url: u('/experts'), lastModified: STATIC_DATE, changeFrequency: 'monthly', priority: 0.6 },
    { url: u('/about'), lastModified: STATIC_DATE, changeFrequency: 'monthly', priority: 0.5 },
    { url: u('/contact'), lastModified: STATIC_DATE, changeFrequency: 'yearly', priority: 0.5 },
    { url: u('/trust'), lastModified: STATIC_DATE, changeFrequency: 'yearly', priority: 0.4 },
    { url: u('/privacy-policy'), lastModified: STATIC_DATE, changeFrequency: 'yearly', priority: 0.2 },
    { url: u('/terms'), lastModified: STATIC_DATE, changeFrequency: 'yearly', priority: 0.2 },
    { url: u('/refund-policy'), lastModified: STATIC_DATE, changeFrequency: 'yearly', priority: 0.2 },
    { url: u('/cancellation-policy'), lastModified: STATIC_DATE, changeFrequency: 'yearly', priority: 0.2 },
    { url: u('/data-deletion'), lastModified: STATIC_DATE, changeFrequency: 'yearly', priority: 0.2 },
    { url: u('/disclaimer'), lastModified: STATIC_DATE, changeFrequency: 'yearly', priority: 0.2 },
  ]

  const categories = CATEGORIES.map((c) => ({ url: u(CATEGORY_PATH[c.id]), lastModified: STATIC_DATE, changeFrequency: 'weekly' as const, priority: 0.9 }))
  const skus = SERVICES.map((s) => ({ url: u(servicePath(s)), lastModified: STATIC_DATE, changeFrequency: 'monthly' as const, priority: s.popular ? 0.85 : 0.7 }))
  const calcs = LIVE_CALCULATORS.map((c) => ({ url: u(`/calculators/${c.slug}`), lastModified: STATIC_DATE, changeFrequency: 'monthly' as const, priority: 0.85 }))
  const dues = DEADLINES.map((d) => ({ url: u(`/due-dates/${d.slug}`), lastModified: new Date(d.lastVerified), changeFrequency: 'weekly' as const, priority: 0.8 }))
  const clusters = CLUSTERS.filter((c) => guidesIn(c.id).length > 0).map((c) => ({ url: u(`/guides/${c.id}`), lastModified: STATIC_DATE, changeFrequency: 'weekly' as const, priority: 0.6 }))
  const guides = GUIDES.map((g) => ({ url: u(guidePath(g)), lastModified: new Date(g.dateModified), changeFrequency: 'monthly' as const, priority: 0.75 }))
  const experts = publishedExperts().map((e) => ({ url: u(`/experts/${e.slug}`), lastModified: STATIC_DATE, changeFrequency: 'monthly' as const, priority: 0.5 }))

  return [...statics, ...categories, ...skus, ...calcs, ...dues, ...clusters, ...guides, ...experts]
}
