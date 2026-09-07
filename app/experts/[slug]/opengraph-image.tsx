import { publishedExperts, getExpert } from '@/app/lib/experts'
import { ogImage, OG_SIZE, OG_CONTENT_TYPE } from '@/app/lib/og'

export const size = OG_SIZE
export const contentType = OG_CONTENT_TYPE
export const alt = 'Sahil Advisory expert profile'

type Params = { slug: string }

export function generateStaticParams(): Params[] {
  return publishedExperts().map((e) => ({ slug: e.slug }))
}

export default async function Image({ params }: { params: Promise<Params> }) {
  const { slug } = await params
  const e = getExpert(slug)
  if (!e) return ogImage({ eyebrow: 'Our panel', title: 'Our tax experts' })

  return ogImage({
    eyebrow: e.title,
    title: e.name,
    subtitle: e.bio,
    chips: e.specialisations.slice(0, 3),
    stat: { label: 'Experience', value: `${e.years} yrs`, sub: e.credential },
  })
}
