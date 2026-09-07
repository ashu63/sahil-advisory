import { CATEGORIES, getCategory, servicesIn, type ServiceCategoryId } from '@/app/lib/services'
import { formatINR } from '@/app/lib/format'
import { ogImage, OG_SIZE, OG_CONTENT_TYPE } from '@/app/lib/og'

export const size = OG_SIZE
export const contentType = OG_CONTENT_TYPE
export const alt = 'Sahil Advisory service category'

type Params = { category: string }

export function generateStaticParams(): Params[] {
  return CATEGORIES.map((c) => ({ category: c.id }))
}

export default async function Image({ params }: { params: Promise<Params> }) {
  const { category } = await params
  const c = getCategory(category)
  if (!c) return ogImage({ eyebrow: 'Services', title: 'Tax and compliance services' })

  const plans = servicesIn(c.id as ServiceCategoryId)
  // Quoted-only plans have a null price and must not read as "from ₹0".
  const priced = plans.map((p) => p.price).filter((p): p is number => p !== null)
  const from = priced.length > 0 ? Math.min(...priced) : null

  return ogImage({
    eyebrow: c.navLabel,
    title: `${c.headline} ${c.headlineEmphasis}`,
    subtitle: c.intro,
    // Two, not three: the audit category's trust lines run to 42 characters and
    // three of them cannot share one chip row without being cut. The first is
    // the one that matters most anyway (who is legally allowed to sign).
    chips: c.trust.slice(0, 2),
    stat: from
      ? { label: 'From', value: formatINR(from), sub: `${plans.length} plans` }
      : { label: 'Plans', value: String(plans.length), sub: 'quoted after triage' },
  })
}
