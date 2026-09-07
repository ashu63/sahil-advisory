import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowRight, AlertTriangle, CheckCircle2 } from 'lucide-react'
import { buildMetadata, breadcrumbJsonLd, graph, ORG_ID } from '@/app/lib/seo'
import { BASE_URL } from '@/app/lib/site'
import { DEADLINES, getDeadlineBySlug, nextDue } from '@/app/lib/due-dates'
import { formatDateIN } from '@/app/lib/format'
import { getService } from '@/app/lib/services'
import { REVIEWER } from '@/app/lib/experts'
import JsonLd from '@/app/components/JsonLd'
import FaqJsonLd from '@/app/components/FaqJsonLd'
import DeadlineWidget from '@/app/components/DeadlineWidget'
import CallbackForm from '@/app/components/CallbackForm'
import { Container, Breadcrumbs, FaqAccordion, Button, CtaBand } from '@/app/components/ui'
import { PlanCard } from '@/app/components/cards'

type Params = { slug: string }

export function generateStaticParams(): Params[] {
  return DEADLINES.map((d) => ({ slug: d.slug }))
}
export const dynamicParams = false
// Countdown text on the server would go stale; keep the page static and let
// the client widget tick. Revalidate daily so the "next due" table row moves.
export const revalidate = 86400

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params
  const d = getDeadlineBySlug(slug)
  if (!d) return {}
  const next = nextDue(d.rule)
  const year = next.getFullYear()
  return buildMetadata({
    title: `${d.label} due date ${year}: ${formatDateIN(next)}`.slice(0, 60),
    description: `${d.intro} Late fee: ${d.lateFee}.`,
    path: `/due-dates/${d.slug}`,
    keywords: d.keywords,
    type: 'article',
    modifiedTime: d.lastVerified,
  })
}

export default async function DueDatePage({ params }: { params: Promise<Params> }) {
  const { slug } = await params
  const d = getDeadlineBySlug(slug)
  if (!d) notFound()
  const path = `/due-dates/${d.slug}`
  const next = nextDue(d.rule)
  const service = d.serviceSlug ? getService(d.serviceSlug) : undefined
  const siblings = DEADLINES.filter((x) => x.category === d.category && x.key !== d.key).slice(0, 3)
  const others = DEADLINES.filter((x) => x.key !== d.key).map((x) => ({ key: x.key, label: x.shortLabel, slug: x.slug, dueIso: nextDue(x.rule).toISOString() })).sort((a, b) => a.dueIso.localeCompare(b.dueIso)).slice(0, 2)

  const jsonLd = graph(
    {
      '@type': 'Article',
      '@id': `${BASE_URL}${path}#article`,
      headline: `${d.label} due date`,
      description: d.intro,
      url: `${BASE_URL}${path}`,
      datePublished: '2026-09-01',
      dateModified: d.lastVerified,
      inLanguage: 'en-IN',
      author: { '@id': ORG_ID },
      publisher: { '@id': ORG_ID },
      reviewedBy: { '@type': 'Person', name: REVIEWER.name, jobTitle: REVIEWER.credential, url: `${BASE_URL}/experts/${REVIEWER.slug}` },
      about: d.form,
    },
    breadcrumbJsonLd([{ name: 'Due dates', path: '/due-dates' }, { name: d.label, path }], path)
  )

  return (
    <>
      <JsonLd data={jsonLd} />
      <FaqJsonLd faqs={d.faqs} />
      <Container className="py-8 lg:py-12">
        <Breadcrumbs crumbs={[{ name: 'Due dates', path: '/due-dates' }, { name: d.label, path }]} />
        <div className="mt-6 grid items-start gap-10 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
          <article>
            <h1 className="text-3xl font-extrabold leading-[1.1] tracking-tight text-navy-900 sm:text-4xl">
              {d.label} due date: <span className="text-green-600">{formatDateIN(next)}</span>
            </h1>
            <p className="mt-3 text-sm text-muted">{d.form} · {d.appliesTo}</p>
            <p className="mt-5 text-lg leading-relaxed text-text-2">{d.intro}</p>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-red-100 bg-red-50 p-5">
                <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-red-600"><AlertTriangle className="h-4 w-4" /> If you miss it</p>
                <p className="mt-2 text-sm font-semibold text-navy-900">{d.lateFee}</p>
                {d.interest && <p className="mt-1 text-sm text-text-2">Interest: {d.interest}</p>}
              </div>
              <div className="rounded-2xl border border-green-100 bg-green-50 p-5">
                <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-green-700"><CheckCircle2 className="h-4 w-4" /> Verified</p>
                <p className="mt-2 text-sm font-semibold text-navy-900">Last verified {formatDateIN(d.lastVerified)}</p>
                <p className="mt-1 text-sm text-text-2">Against <a href={d.sourceUrl} target="_blank" rel="noopener noreferrer" className="underline">{new URL(d.sourceUrl).hostname}</a>. Updated within 24 hours of any extension.</p>
              </div>
            </div>

            <div className="prose-tax mt-8">
              {d.body.map((p, i) => <p key={i}>{p}</p>)}
            </div>

            {service && (
              <div className="mt-10">
                <h2 className="text-xl font-bold text-navy-900">Let us handle this filing</h2>
                <div className="mt-4 max-w-sm"><PlanCard service={service} compact /></div>
              </div>
            )}

            <div className="mt-12">
              <FaqAccordion faqs={d.faqs} title={`${d.label}: questions`} />
            </div>

            {siblings.length > 0 && (
              <div className="mt-10">
                <h2 className="text-lg font-bold text-navy-900">Related deadlines</h2>
                <ul className="mt-3 divide-y divide-border rounded-2xl border border-border bg-card">
                  {siblings.map((s) => (
                    <li key={s.key}>
                      <Link href={`/due-dates/${s.slug}`} className="flex items-center justify-between px-4 py-3 text-sm font-semibold text-navy-900 hover:text-green-700">
                        {s.label} <span className="font-mono text-xs text-muted">{formatDateIN(nextDue(s.rule))}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
                <Button href="/due-dates" variant="ghost" className="mt-3" icon>Full calendar</Button>
              </div>
            )}
          </article>

          <aside className="space-y-6 lg:sticky lg:top-24">
            <DeadlineWidget items={[{ key: d.key, label: d.shortLabel, slug: d.slug, dueIso: next.toISOString() }, ...others]} title="Countdown" />
            <CallbackForm compact service={d.label} title="Get this filed before the deadline" options={{ label: 'Status', values: ['Not started', 'Documents ready', 'Already late'] }} />
          </aside>
        </div>
        <div className="mt-16">
          <CtaBand title="Deadlines keep coming. Hand them over." desc="GST and TDS retainers include reminders, reconciliation and filing before every due date, with a monthly summary on WhatsApp." primary={{ label: 'See GST plans', href: '/services/gst' }} secondary={{ label: 'See TDS plans', href: '/services/tds' }} />
        </div>
        <p className="mt-6 text-sm"><Link href="/due-dates" className="inline-flex items-center gap-1 font-semibold text-green-700">All due dates <ArrowRight className="h-4 w-4" /></Link></p>
      </Container>
    </>
  )
}
