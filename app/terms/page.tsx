import JsonLd from '@/app/components/JsonLd'
import { Breadcrumbs, Container } from '@/app/components/ui'
import { breadcrumbJsonLd, buildMetadata, graph, webPageJsonLd } from '@/app/lib/seo'
import { SITE } from '@/app/lib/site'

const PAGE = {
  title: 'Terms of Service',
  path: '/terms',
  description:
    'Terms governing tax filing, GST, TDS and consultation services from Sahil Advisory: scope, your responsibilities, fees, liability limits and jurisdiction.',
} as const

const LAST_UPDATED = '6 September 2026'

export const metadata = buildMetadata({
  title: PAGE.title,
  description: PAGE.description,
  path: PAGE.path,
})

export default function TermsPage() {
  const crumbs = [{ name: PAGE.title, path: PAGE.path }]
  return (
    <>
      <JsonLd
        data={graph(
          webPageJsonLd({ path: PAGE.path, name: PAGE.title, description: PAGE.description }),
          breadcrumbJsonLd(crumbs, PAGE.path)
        )}
      />
      <Container className="py-12 lg:py-16">
        <Breadcrumbs crumbs={crumbs} />
        <h1 className="mt-6 text-3xl sm:text-4xl font-extrabold tracking-tight text-navy-900">{PAGE.title}</h1>
        <p className="mt-2 text-sm text-muted">Last updated: {LAST_UPDATED}</p>

        <div className="prose-tax mt-8 max-w-3xl">
          <p>
            These terms apply when you order a service, book a consultation or otherwise use the {SITE.name} website
            and platform. By placing an order you accept them. If you do not agree, please do not use the service.
            Read them together with our <a href="/privacy-policy">Privacy Policy</a>,{' '}
            <a href="/refund-policy">Refund Policy</a> and <a href="/cancellation-policy">Cancellation Policy</a>.
          </p>

          <h2>1. What we do</h2>
          <p>
            {SITE.legalName} arranges the preparation and filing of income tax returns, GST returns, TDS returns,
            registrations, notice replies and related compliance work, based on the information and documents you
            supply. Work is carried out by qualified professionals on our panel (Cost and Management Accountants,
            Chartered Accountants and Company Secretaries). Tax audit, statutory audit and any certification that the
            law reserves for Chartered Accountants is performed only by an empanelled Chartered Accountant in their
            own name.
          </p>

          <h2>2. Your responsibilities</h2>
          <ul>
            <li>Provide complete, accurate and current information. We prepare filings on what you give us and do not verify it against external sources unless the service says so.</li>
            <li>Send documents within the time we ask for. Late documents move your turnaround date and may cause a statutory due date to be missed, for which late fees under the Income-tax Act or GST law are yours to bear.</li>
            <li>Review the draft return or computation we share and confirm it before filing. Once you approve, the filing is made on your instruction.</li>
            <li>Keep your portal passwords and OTPs secure. Share them only when the platform asks for them for a task you have approved.</li>
            <li>Tell us promptly if any information changes, or if you receive any tax notice.</li>
          </ul>

          <h2>3. Turnaround times</h2>
          <p>
            Turnaround periods shown on the site are estimates measured from the time we receive all required
            documents and your confirmation. They are not guarantees. Government portal downtime, peak season load
            and incomplete information can extend them. We will keep you informed on WhatsApp or email.
          </p>

          <h2>4. Fees, GST and invoices</h2>
          <ul>
            <li>All prices are in Indian Rupees and exclude GST, which is added at the applicable rate (currently 18%).</li>
            <li>Fees are payable in advance unless a written quote says otherwise. Work begins after payment is confirmed.</li>
            <li>Government fees, challans, late fees, penalties and stamp duty are separate and are payable by you at actuals.</li>
            <li>A tax invoice is issued for every payment and is available in your account and by email.</li>
            <li>If the scope grows after we start (for example, additional income sources or an extra GSTIN), we quote the difference before continuing.</li>
          </ul>

          <h2>5. No guarantee of outcome</h2>
          <p>
            We do not guarantee any refund amount, tax saving, assessment outcome, registration approval or the
            timing of a refund from the department. These depend on the facts you give us, on the law and on the
            authorities. Where we make an error in preparation that is our fault, we will correct it and file a
            revised return at no charge.
          </p>

          <h2>6. Limitation of liability</h2>
          <p>
            To the extent permitted by law, our total liability for any claim arising from a service is limited to
            the fees you paid us for that service. We are not liable for indirect or consequential loss, for
            interest or penalties caused by information you supplied late or incorrectly, or for the acts of
            government portals and third-party providers. Nothing here limits liability that cannot be limited under
            Indian law.
          </p>

          <h2>7. Intellectual property</h2>
          <p>
            The website, calculators, guides, templates and brand assets belong to {SITE.legalName}. You may use them
            for your own tax planning and compliance, and you may not copy, resell or redistribute them. Documents
            you upload remain yours; you grant us a licence to use them only to deliver the service.
          </p>

          <h2>8. Communication consent</h2>
          <p>
            By giving us your mobile number and email, you agree to receive service messages, reminders and
            documents on WhatsApp, SMS and email. We may also send occasional filing season reminders and offers;
            you can opt out of those any time by replying STOP or using the unsubscribe link.
          </p>

          <h2>9. Termination</h2>
          <p>
            You may stop using the service at any time; refunds are governed by the Refund Policy. We may decline or
            end an engagement if we believe the information given to us is false, if the work would require us to
            act against the law or professional rules, or if payment is not received. In that case we refund any
            fee for work not yet performed.
          </p>

          <h2>10. Governing law and jurisdiction</h2>
          <p>
            These terms are governed by the laws of India. Courts at Chandigarh have exclusive jurisdiction over any
            dispute, subject to the parties first attempting to resolve it in good faith by discussion.
          </p>

          <h2>11. General</h2>
          <p>
            If any part of these terms is held invalid, the rest continues to apply. We may update these terms; the
            version dated at the top applies to orders placed after that date. Questions about these terms can be
            sent to <a href={`mailto:${SITE.email}`}>{SITE.email}</a>.
          </p>
        </div>
      </Container>
    </>
  )
}
