import { SERVICES, getService, getCategory, unitSuffix } from '@/app/lib/services'
import { formatINR } from '@/app/lib/format'
import { ogImage, OG_SIZE, OG_CONTENT_TYPE } from '@/app/lib/og'

export const size = OG_SIZE
export const contentType = OG_CONTENT_TYPE
export const alt = 'Sahil Advisory service plan and price'

type Params = { category: string; sku: string }

export function generateStaticParams(): Params[] {
  return SERVICES.map((s) => ({ category: s.category, sku: s.slug }))
}

export default async function Image({ params }: { params: Promise<Params> }) {
  const { sku } = await params
  const s = getService(sku)
  if (!s) return ogImage({ eyebrow: 'Services', title: 'Tax and compliance services' })

  const category = getCategory(s.category)
  const suffix = unitSuffix(s.unit)

  return ogImage({
    eyebrow: category?.navLabel ?? 'Services',
    title: s.name,
    subtitle: s.shortDesc,
    // whoFor says who the plan is for in one line. The includes[] entries are
    // full sentences and only ever truncated into nonsense at chip width.
    chips: [`Turnaround ${s.turnaroundDays}`, s.whoFor],
    stat:
      s.price === null
        ? { label: 'Pricing', value: 'On quote', sub: s.quoteLabel ?? 'after free triage' }
        : {
            label: 'Starting at',
            value: `${formatINR(s.price)}${suffix}`,
            // Only claim a discount when there is one.
            sub: s.mrp > s.price ? `MRP ${formatINR(s.mrp)}` : undefined,
          },
  })
}
