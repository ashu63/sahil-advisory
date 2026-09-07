import { LIVE_CALCULATORS, getCalculator } from '@/app/lib/calculators'
import { ogImage, OG_SIZE, OG_CONTENT_TYPE } from '@/app/lib/og'

export const size = OG_SIZE
export const contentType = OG_CONTENT_TYPE
export const alt = 'Free tax calculator from Sahil Advisory'

type Params = { slug: string }

// Phase 1 calculators are shown as coming soon and are not indexable, so only
// the live ones get a card.
export function generateStaticParams(): Params[] {
  return LIVE_CALCULATORS.map((c) => ({ slug: c.slug }))
}

export default async function Image({ params }: { params: Promise<Params> }) {
  const { slug } = await params
  const c = getCalculator(slug)
  if (!c) return ogImage({ eyebrow: 'Calculators', title: 'Free tax calculators' })

  return ogImage({
    eyebrow: 'Calculator',
    title: c.name,
    subtitle: c.intro,
    chips: ['Free, no sign-up', c.updatedFor],
  })
}
