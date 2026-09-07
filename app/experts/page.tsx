import type { Metadata } from 'next'
import { buildMetadata, breadcrumbJsonLd, graph, webPageJsonLd } from '@/app/lib/seo'
import { publishedExperts } from '@/app/lib/experts'
import JsonLd from '@/app/components/JsonLd'
import { Container, Breadcrumbs, SectionHeading, CtaBand } from '@/app/components/ui'
import { ExpertCard } from '@/app/components/cards'

export const metadata: Metadata = buildMetadata({
  title: 'Our Tax Experts | CMA and CA Panel',
  description: 'Meet the qualified professionals who prepare and review every return: Cost and Management Accountants, Chartered Accountants and GST practitioners. Credentials, specialisations and languages listed for each expert.',
  path: '/experts',
  keywords: ['tax expert chandigarh', 'cma tax consultant', 'gst practitioner chandigarh', 'tax consultant panchkula'],
})

export default function ExpertsPage() {
  const experts = publishedExperts()
  return (
    <>
      <JsonLd data={graph(webPageJsonLd({ path: '/experts', name: 'Our experts', description: metadata.description as string }), breadcrumbJsonLd([{ name: 'Experts', path: '/experts' }], '/experts'))} />
      <Container className="py-10 lg:py-16">
        <Breadcrumbs crumbs={[{ name: 'Experts', path: '/experts' }]} />
        <div className="mt-6">
          <SectionHeading align="left" eyebrow="The panel" title="Real names. Real credentials." desc="Every return, registration and notice reply is prepared and reviewed by a member of this panel. You see who is handling your order and can message them directly." />
        </div>
        <div className="mt-10 grid gap-5 md:grid-cols-2">
          {experts.map((e) => <ExpertCard key={e.slug} expert={e} />)}
        </div>
        <div className="mt-8 rounded-2xl border border-border bg-bg-alt p-6 text-sm leading-relaxed text-text-2">
          <p className="font-bold text-navy-900">A note on who does what</p>
          <p className="mt-2">Cost and Management Accountants (ICMAI) and Chartered Accountants (ICAI) can both prepare and file income tax returns, GST returns and TDS statements, and CMAs are approved GST practitioners under section 48 of the CGST Act. Tax audit reports under section 44AB, statutory audits and certain certificates are reserved for Chartered Accountants, and we deliver those through empanelled CAs. We name the professional on every order so there is never any ambiguity.</p>
        </div>
        <div className="mt-16"><CtaBand title="Are you a CA or CS who wants to join the panel?" desc="We are adding Chartered Accountants for audit-tier work and Company Secretaries for ROC compliance. Write to us with your membership details." primary={{ label: 'Contact us', href: '/contact' }} secondary={{ label: 'See services', href: '/services' }} /></div>
      </Container>
    </>
  )
}
