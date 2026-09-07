import type { Metadata } from 'next'
import { buildMetadata, breadcrumbJsonLd, graph, webPageJsonLd } from '@/app/lib/seo'
import { BASE_URL, SITE } from '@/app/lib/site'
import { CALCULATORS, LIVE_CALCULATORS } from '@/app/lib/calculators'
import JsonLd from '@/app/components/JsonLd'
import { Container, Breadcrumbs, SectionHeading, CtaBand } from '@/app/components/ui'
import { CalculatorCard } from '@/app/components/cards'

export const metadata: Metadata = buildMetadata({
  title: `Free Tax Calculators FY ${SITE.currentFY} | Income Tax, HRA, GST`,
  description: 'Free calculators updated for FY 2025-26: income tax old vs new regime, HRA exemption, capital gains, GST, TDS, advance tax instalments, take-home salary and a rent receipt generator.',
  path: '/calculators',
  keywords: ['tax calculators india', 'income tax calculator', 'hra calculator', 'capital gains calculator', 'gst calculator', 'tds calculator', 'advance tax calculator'],
})

export default function CalculatorsHub() {
  return (
    <>
      <JsonLd
        data={graph(
          { ...webPageJsonLd({ path: '/calculators', name: 'Tax calculators', description: metadata.description as string }), '@type': 'CollectionPage' },
          breadcrumbJsonLd([{ name: 'Calculators', path: '/calculators' }], '/calculators'),
          {
            '@type': 'ItemList',
            '@id': `${BASE_URL}/calculators#list`,
            itemListElement: LIVE_CALCULATORS.map((c, i) => ({ '@type': 'ListItem', position: i + 1, name: c.name, url: `${BASE_URL}/calculators/${c.slug}` })),
          }
        )}
      />
      <Container className="py-10 lg:py-16">
        <Breadcrumbs crumbs={[{ name: 'Calculators', path: '/calculators' }]} />
        <div className="mt-6">
          <SectionHeading align="left" eyebrow="Free tools" title="Tax calculators updated for" emphasis={`FY ${SITE.currentFY}`} desc="Every calculator uses the rules in force for the current year and explains the working underneath. Estimates only; your expert confirms the final numbers." />
        </div>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {CALCULATORS.map((c) => (
            <CalculatorCard key={c.slug} calc={c} />
          ))}
        </div>
        <div className="mt-16">
          <CtaBand title="Numbers look different from what you expected?" desc="A 30-minute consultation with a qualified professional costs ₹499 and is adjusted against filing. Bring the calculator result and your Form 16." primary={{ label: 'Book a consultation', href: '/consult' }} secondary={{ label: 'See ITR plans', href: '/services/itr' }} />
        </div>
      </Container>
    </>
  )
}
