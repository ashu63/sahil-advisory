import type { Metadata } from 'next'
import { BASE_URL, SITE } from './site'

type BuildMetadataInput = {
  title: string
  description: string
  path: string
  keywords?: string[]
  noindex?: boolean
  type?: 'website' | 'article'
  publishedTime?: string
  modifiedTime?: string
}

// Google truncates around 160 characters. Pages that build a description by
// joining registry fields can overshoot, so clamp at a word boundary: a
// description cut mid-word ("1 business ") reads as broken in the SERP.
const DANGLING = new Set([
  'a', 'an', 'and', 'or', 'the', 'of', 'to', 'in', 'on', 'at', 'by', 'for',
  'from', 'with', 'is', 'are', 'as', 'that', 'than', 'when', 'if', 'per',
])

export function clampDescription(text: string, max = 160): string {
  const s = text.replace(/\s+/g, ' ').trim()
  if (s.length <= max) return s
  const cut = s.slice(0, max + 1)
  const lastSpace = cut.lastIndexOf(' ')
  const words = cut.slice(0, lastSpace > 0 ? lastSpace : max).split(' ')
  // Drop trailing connectives so the snippet never ends on "and" or "or".
  while (words.length > 1 && DANGLING.has(words[words.length - 1].toLowerCase())) words.pop()
  return words.join(' ').replace(/[,;:.\s]+$/, '')
}

// Every indexable route calls this so canonical/OG/Twitter/robots are always
// consistent. The root layout deliberately sets NO canonical (it would cascade
// and mark every page a duplicate of "/").
export function buildMetadata(input: BuildMetadataInput): Metadata {
  const url = `${BASE_URL}${input.path === '/' ? '' : input.path}`
  const description = clampDescription(input.description)
  const robots = input.noindex
    ? { index: false, follow: false }
    : {
        index: true,
        follow: true,
        googleBot: {
          index: true,
          follow: true,
          'max-snippet': -1,
          'max-image-preview': 'large' as const,
          'max-video-preview': -1,
        },
      }
  return {
    title: input.title,
    description,
    keywords: input.keywords,
    alternates: { canonical: input.path },
    robots,
    openGraph: {
      type: input.type ?? 'website',
      locale: 'en_IN',
      url,
      siteName: SITE.name,
      title: input.title,
      description,
      ...(input.type === 'article'
        ? { publishedTime: input.publishedTime, modifiedTime: input.modifiedTime }
        : {}),
    },
    twitter: {
      card: 'summary_large_image',
      title: input.title,
      description,
    },
  }
}

export type Crumb = { name: string; path: string }

export function breadcrumbJsonLd(crumbs: Crumb[], pagePath: string) {
  return {
    '@type': 'BreadcrumbList',
    '@id': `${BASE_URL}${pagePath}#breadcrumb`,
    itemListElement: [{ name: 'Home', path: '/' }, ...crumbs].map((c, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: c.name,
      item: `${BASE_URL}${c.path === '/' ? '' : c.path}`,
    })),
  }
}

export const ORG_ID = `${BASE_URL}#organization`

export function organizationJsonLd() {
  const sameAs = Object.values(SITE.social).filter(Boolean)
  return [
    {
      '@type': 'WebSite',
      '@id': `${BASE_URL}#website`,
      name: SITE.name,
      url: BASE_URL,
      publisher: { '@id': ORG_ID },
      inLanguage: 'en-IN',
    },
    {
      '@type': ['Organization', 'AccountingService'],
      '@id': ORG_ID,
      name: SITE.name,
      legalName: SITE.legalName,
      url: BASE_URL,
      logo: {
        '@type': 'ImageObject',
        '@id': `${BASE_URL}#logo`,
        url: `${BASE_URL}/icon`,
        caption: SITE.name,
      },
      description: SITE.shortDescription,
      telephone: SITE.phoneE164,
      email: SITE.email,
      priceRange: '₹499 - ₹14,999',
      openingHours: SITE.openingHours,
      areaServed: { '@type': 'Country', name: 'India' },
      address: {
        '@type': 'PostalAddress',
        streetAddress: SITE.address.street,
        addressLocality: SITE.address.locality,
        addressRegion: SITE.address.region,
        postalCode: SITE.address.postalCode,
        addressCountry: SITE.address.country,
      },
      sameAs,
    },
  ]
}

export function webPageJsonLd(input: {
  path: string
  name: string
  description: string
}) {
  return {
    '@type': 'WebPage',
    '@id': `${BASE_URL}${input.path}#webpage`,
    url: `${BASE_URL}${input.path}`,
    name: input.name,
    description: input.description,
    isPartOf: { '@id': `${BASE_URL}#website` },
    inLanguage: 'en-IN',
  }
}

export function graph(...members: unknown[]) {
  return { '@context': 'https://schema.org', '@graph': members.flat() }
}
