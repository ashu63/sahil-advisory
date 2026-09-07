import JsonLd from '@/app/components/JsonLd'
import { Breadcrumbs, Container } from '@/app/components/ui'
import { breadcrumbJsonLd, buildMetadata, graph, webPageJsonLd } from '@/app/lib/seo'
import { SITE } from '@/app/lib/site'

const PAGE = {
  title: 'Privacy Policy',
  path: '/privacy-policy',
  description:
    'How Sahil Advisory collects, uses, stores and deletes your personal and financial data under the DPDP Act 2023, including your rights and grievance contact.',
} as const

const LAST_UPDATED = '6 September 2026'

export const metadata = buildMetadata({
  title: PAGE.title,
  description: PAGE.description,
  path: PAGE.path,
})

export default function PrivacyPolicyPage() {
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
            {SITE.legalName} (&quot;we&quot;, &quot;us&quot;) provides tax filing and compliance services in India. To
            do that work we must handle some of the most sensitive information a person has: PAN, Aadhaar, bank
            details and income records. This policy explains what we collect, why, who can see it, how long we
            keep it and what you can ask us to do with it. It is written to follow the Digital Personal Data
            Protection Act, 2023 (DPDP Act) and the rules made under it.
          </p>

          <h2>What we collect</h2>
          <ul>
            <li>Identity and contact details: name, mobile number, email address and postal address.</li>
            <li>Tax identifiers: PAN, Aadhaar number (where required for e-verification or registration), GSTIN and TAN.</li>
            <li>
              Financial documents you upload: Form 16, Form 26AS, AIS, bank statements, salary slips, invoices,
              capital gains statements, rent receipts and similar records.
            </li>
            <li>Portal credentials you choose to share for filing, such as income tax portal or GST portal access, only for the task you approve.</li>
            <li>Payment confirmation data from our payment gateway. We never receive or store your card number, CVV or UPI PIN.</li>
            <li>Usage data: pages visited, device type, approximate location from IP address, and how you move through the site.</li>
          </ul>

          <h2>Why we collect it (purpose limitation)</h2>
          <p>
            We use your data only for the purpose you gave it to us: preparing and filing your returns, completing
            a registration, replying to a notice, running a consultation, sending status updates, issuing invoices
            and meeting our own legal record-keeping duties. We do not sell personal data, and we do not use your
            financial documents for advertising or profiling.
          </p>

          <h2>Consent at upload</h2>
          <p>
            Each time you upload a document or share a portal credential, we ask you to confirm that you consent to
            its use for the stated service. You can withdraw consent at any time by writing to us. Withdrawal does
            not affect processing already completed, and it may mean we cannot finish a pending filing.
          </p>

          <h2>Who can see your data</h2>
          <p>
            Access is limited to two roles: the expert assigned to your order, and platform administrators who
            manage assignments and quality checks. Other experts on the panel cannot open your file. Every view and
            download is recorded in an access log. Our support team sees your name, contact details and order
            status, not your uploaded documents.
          </p>

          <h2>How we store it</h2>
          <ul>
            <li>Documents are encrypted at rest and served only through private storage buckets, never public links.</li>
            <li>All traffic between your device and our servers uses TLS encryption.</li>
            <li>Application data and documents are hosted on servers located in India.</li>
            <li>PAN and Aadhaar are masked in our internal screens and are never written to application logs.</li>
          </ul>

          <h2>How long we keep it</h2>
          <p>
            Copies of filed returns, acknowledgements, computations and invoices are kept for eight years from the
            end of the relevant financial year. This is our professional working record and matches the period for
            which tax authorities can reopen or ask about a return. Raw uploaded documents such as bank statements
            and salary slips are not needed for that long; you can ask us to delete them at any time after your
            filing is complete. See our <a href="/data-deletion">data deletion page</a> for the process.
          </p>

          <h2>Third parties we work with</h2>
          <p>We share only the minimum needed with these categories of providers, each bound by contract to protect it:</p>
          <ul>
            <li>Payment gateway, to process your payment (PCI DSS compliant).</li>
            <li>Email, SMS and WhatsApp Business messaging providers, to send order updates and documents you request.</li>
            <li>Analytics and product tools: Google Analytics, Microsoft Clarity, PostHog and Vercel Analytics, which receive usage data and never your uploaded documents.</li>
            <li>Government portals (Income Tax, GST, MCA) when we file on your behalf, which is the purpose of the service.</li>
          </ul>
          <p>We will disclose data to a court, regulator or law enforcement agency only when legally required to do so.</p>

          <h2>Cookies</h2>
          <p>
            We use essential cookies to keep you signed in and to remember your preferences, and analytics cookies
            to understand how the site is used. You can block cookies in your browser settings; the site will still
            work, though some conveniences may stop.
          </p>

          <h2>Your rights</h2>
          <ul>
            <li>Access: ask what personal data we hold about you and receive a summary.</li>
            <li>Correction: ask us to fix inaccurate or incomplete data.</li>
            <li>Erasure: ask us to delete data we are not legally required to keep.</li>
            <li>Withdrawal: withdraw consent for any processing that is not yet complete.</li>
            <li>Grievance: raise a complaint and receive a response within the time set under the DPDP Act.</li>
            <li>Nomination: name a person who may exercise these rights on your behalf if you are unable to.</li>
          </ul>

          <h2>Grievance officer</h2>
          <p>
            Write to our grievance officer at <a href={`mailto:${SITE.email}`}>{SITE.email}</a> with the subject
            &quot;Privacy grievance&quot;, or by post to {SITE.address.street}, {SITE.address.locality}{' '}
            {SITE.address.postalCode}. We acknowledge within 48 hours and aim to resolve within 30 days. If you are
            not satisfied, you may approach the Data Protection Board of India.
          </p>

          <h2>Children</h2>
          <p>
            Our services are for adults. Where a return must be filed for a minor (for example, income clubbed
            with a parent), we process the minor&apos;s data only on the verifiable consent of the parent or
            guardian.
          </p>

          <h2>Changes to this policy</h2>
          <p>
            We may update this policy when our services or the law change. The date at the top shows the current
            version. For material changes we will notify registered users by email or WhatsApp before the change
            takes effect.
          </p>
        </div>
      </Container>
    </>
  )
}
