import type { Metadata } from 'next'
import { Phone, Mail, MapPin, Clock, MessageCircle } from 'lucide-react'
import { buildMetadata, breadcrumbJsonLd, graph, webPageJsonLd } from '@/app/lib/seo'
import { SITE, WHATSAPP_DEFAULT } from '@/app/lib/site'
import JsonLd from '@/app/components/JsonLd'
import CallbackForm from '@/app/components/CallbackForm'
import TrackedLink from '@/app/components/TrackedLink'
import { Container, Breadcrumbs, SectionHeading } from '@/app/components/ui'

export const metadata: Metadata = buildMetadata({
  title: 'Contact Sahil Advisory | Callback, WhatsApp, Phone',
  description: 'Request a callback from a tax expert, chat on WhatsApp or call +91 78884 12302. Offices in Chandigarh and Panchkula, clients served across India online. Mon to Sat, 10 AM to 7 PM IST.',
  path: '/contact',
  keywords: ['contact tax consultant chandigarh', 'sahil advisory contact', 'tax consultant panchkula phone'],
})

export default function ContactPage() {
  const items = [
    { icon: MessageCircle, title: 'WhatsApp', text: 'Fastest. Send the service name and we reply within working hours.', href: WHATSAPP_DEFAULT, label: 'Chat now', external: true },
    { icon: Phone, title: 'Call', text: SITE.hours, href: `tel:${SITE.phoneE164}`, label: SITE.phoneDisplay },
    { icon: Mail, title: 'Email', text: 'Documents and detailed queries.', href: `mailto:${SITE.email}`, label: SITE.email },
  ]
  return (
    <>
      <JsonLd data={graph({ ...webPageJsonLd({ path: '/contact', name: 'Contact', description: metadata.description as string }), '@type': 'ContactPage' }, breadcrumbJsonLd([{ name: 'Contact', path: '/contact' }], '/contact'))} />
      <Container className="py-10 lg:py-16">
        <Breadcrumbs crumbs={[{ name: 'Contact', path: '/contact' }]} />
        <div className="mt-6 grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
          <div>
            <SectionHeading align="left" eyebrow="Contact" title="Talk to a person," emphasis="not a ticket." desc="Tell us what you need and a tax expert calls back within 2 working hours." />
            <ul className="mt-8 space-y-4">
              {items.map((it) => (
                <li key={it.title} className="flex gap-4 rounded-2xl border border-border bg-card p-5 shadow-[var(--shadow-card)]">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-green-50 text-green-700"><it.icon className="h-5 w-5" /></span>
                  <div>
                    <p className="font-bold text-navy-900">{it.title}</p>
                    <p className="text-sm text-text-2">{it.text}</p>
                    <TrackedLink event={it.title === 'Call' ? 'call_click' : 'whatsapp_click'} props={{ placement: 'contact', channel: it.title.toLowerCase() }} href={it.href} target={it.external ? '_blank' : undefined} rel={it.external ? 'noopener noreferrer' : undefined} className="mt-1 inline-block font-mono text-sm font-semibold text-green-700 hover:underline">{it.label}</TrackedLink>
                  </div>
                </li>
              ))}
              <li className="flex gap-4 rounded-2xl border border-border bg-card p-5 shadow-[var(--shadow-card)]">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-green-50 text-green-700"><MapPin className="h-5 w-5" /></span>
                <div>
                  <p className="font-bold text-navy-900">Offices</p>
                  <address className="text-sm not-italic text-text-2">{SITE.address.street}, {SITE.address.locality} {SITE.address.postalCode}<br />{SITE.address.secondOffice}</address>
                  <p className="mt-1 flex items-center gap-1 text-xs text-muted"><Clock className="h-3.5 w-3.5" /> {SITE.hours}. Visits by appointment.</p>
                </div>
              </li>
            </ul>
          </div>
          <div className="lg:pt-16">
            <CallbackForm title="Request a callback" subtitle="We call from a Chandigarh number. Free, no obligation." />
          </div>
        </div>
      </Container>
    </>
  )
}
