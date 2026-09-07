import JsonLd from '@/app/components/JsonLd'
import { Breadcrumbs, Container } from '@/app/components/ui'
import { breadcrumbJsonLd, buildMetadata, graph, webPageJsonLd } from '@/app/lib/seo'
import { SITE } from '@/app/lib/site'

const PAGE = {
  title: 'Security and Privacy',
  path: '/trust',
  description:
    'How Sahil Advisory protects your PAN, Aadhaar and financial documents: encryption, private storage, audit-logged access, India hosting and breach response.',
} as const

const LAST_UPDATED = '6 September 2026'

export const metadata = buildMetadata({
  title: PAGE.title,
  description: PAGE.description,
  path: PAGE.path,
})

const NEVER_ASK = [
  'Your income tax portal, GST portal or bank password over WhatsApp, SMS, email or a phone call. Credentials are entered only inside the secure form on the platform, for a task you have ordered.',
  'An OTP for anything other than a filing or e-verification you have approved. We tell you in advance which OTP we need and what it is for.',
  'Your card number, CVV, UPI PIN, net banking password or ATM PIN. Payments happen only on the gateway page, never in chat.',
  'Payment to a personal UPI ID or bank account. All fees are paid through the checkout link or the invoice with our registered details.',
  'Remote access to your phone or computer through screen-sharing apps.',
  'Any fee to release a refund from the Income Tax Department. Refunds are paid by the department directly to your bank account.',
] as const

export default function TrustPage() {
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
            You hand us your PAN, your bank statements and your income for the year. That is a lot of trust, and
            this page explains, in concrete terms, what we do to deserve it. If you want the legal version, read
            the <a href="/privacy-policy">Privacy Policy</a>. This page is the practical one.
          </p>

          <h2>Encryption everywhere</h2>
          <ul>
            <li>Every connection to the site and the platform uses HTTPS with TLS 1.2 or higher. Plain HTTP requests are redirected.</li>
            <li>Documents are encrypted at rest with AES-256 in the storage layer. Database backups are encrypted as well.</li>
            <li>Encryption keys are managed by the cloud provider&apos;s key service and are never stored alongside the data or in application code.</li>
          </ul>

          <h2>Private document storage</h2>
          <p>
            Uploaded files go into private storage buckets with no public access. When your expert opens a
            document, the platform creates a signed link that expires within minutes and works only for that
            file and that session. There is no permanent URL to any document, so a leaked link is useless after it
            expires. Files are scanned for malware on upload.
          </p>

          <h2>Who can open your file</h2>
          <ul>
            <li>Only the expert assigned to your order and platform administrators can view your documents.</li>
            <li>Other panel members cannot see your order, even by searching for your name or PAN.</li>
            <li>Every view, download and edit is written to an audit log with the user, the time and the file. You can request a copy of the log for your account.</li>
            <li>Staff and panel members sign confidentiality agreements and lose access the moment their engagement ends.</li>
            <li>Administrator access requires two-factor authentication.</li>
          </ul>

          <h2>Sensitive fields are masked</h2>
          <p>
            PAN and Aadhaar numbers are shown masked (for example, ABCPX****K) in every internal screen, list and
            notification. The full value is revealed only inside the filing form, only to the assigned expert, and
            that reveal is itself logged. Uploaded documents, their contents and identifiers are never written to
            application logs, error reports or analytics events.
          </p>

          <h2>Payments</h2>
          <p>
            Payments are processed by a PCI DSS Level 1 certified payment gateway. Your card number, CVV, UPI PIN or
            net banking credentials are entered on the gateway&apos;s page and never touch our servers. We receive
            only a payment reference, the amount and the status. Refunds are made through the same gateway back to
            the original payment method.
          </p>

          <h2>Where your data lives</h2>
          <p>
            The application, database and document storage are hosted in cloud data centres located in India.
            Analytics and messaging providers listed in the Privacy Policy receive only the minimum data needed to
            do their job, and none of them receive your uploaded documents.
          </p>

          <h2>Backups and availability</h2>
          <p>
            Encrypted backups are taken daily and kept for 30 days, so an accidental deletion or a failure on our
            side does not lose your filing history. Backups are stored in a separate India-region location from
            the live systems and are restore-tested every quarter.
          </p>

          <h2>If something goes wrong</h2>
          <p>
            We keep an incident response plan. If we discover or are told about a breach affecting your personal
            data, we contain it, assess what was affected, and notify you and the Data Protection Board of India as
            required under the DPDP Act, 2023. Our notice to you will say what happened, what data was involved,
            what we have done and what you should do, for example changing a password. We do not hide incidents to
            protect our reputation.
          </p>

          <h2>Report a security issue</h2>
          <p>
            If you find a vulnerability on this site or the platform, or you receive a suspicious message claiming
            to be from us, email <a href={`mailto:${SITE.email}`}>{SITE.email}</a> with the subject &quot;Security
            report&quot;. We acknowledge within 48 hours, keep you informed while we fix it, and will not take action
            against good-faith researchers who report responsibly and do not access other people&apos;s data.
          </p>

          <h2>What we will never ask for</h2>
          <p>Fraudsters sometimes impersonate tax firms. Whatever the message says, {SITE.name} will never ask for:</p>
          <ul>
            {NEVER_ASK.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <p>
            If you get a request like this, do not respond. Forward it to{' '}
            <a href={`mailto:${SITE.email}`}>{SITE.email}</a> or call us on {SITE.phoneDisplay} to check. Our only
            official contact points are the number and email listed on this website.
          </p>
        </div>
      </Container>
    </>
  )
}
