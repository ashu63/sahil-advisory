import JsonLd from '@/app/components/JsonLd'
import { Breadcrumbs, Container } from '@/app/components/ui'
import { breadcrumbJsonLd, buildMetadata, graph, webPageJsonLd } from '@/app/lib/seo'
import { SITE, whatsappLink } from '@/app/lib/site'

const PAGE = {
  title: 'Data Deletion Request',
  path: '/data-deletion',
  description:
    'Request deletion of your Sahil Advisory account and uploaded documents: how we verify identity, what is erased within 30 days, and what we must retain by law.',
} as const

const LAST_UPDATED = '6 September 2026'

export const metadata = buildMetadata({
  title: PAGE.title,
  description: PAGE.description,
  path: PAGE.path,
})

const DELETE_SUBJECT = 'Data deletion request'
const WHATSAPP_DELETE = whatsappLink(
  `Hi ${SITE.name}, I want to request deletion of my account and documents. My registered email is: `
)

export default function DataDeletionPage() {
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
            You can ask us to delete your account and the documents you have uploaded at any time. This page
            explains how to make the request, how we check that it really comes from you, what gets deleted, and
            the small set of records the law requires us to keep. The right to erasure is given to you by the
            Digital Personal Data Protection Act, 2023, and we honour it without asking for a reason.
          </p>

          <h2>How to request deletion</h2>
          <p>Use either channel below. Both are checked every working day.</p>
          <ol>
            <li>
              <strong>Email.</strong> Send a message to{' '}
              <a href={`mailto:${SITE.email}?subject=${encodeURIComponent(DELETE_SUBJECT)}`}>{SITE.email}</a> from
              the email address registered on your account. Use the exact subject line &quot;{DELETE_SUBJECT}&quot;
              so it is routed to the privacy queue without delay.
            </li>
            <li>
              <strong>WhatsApp.</strong> Message us at {SITE.phoneDisplay} from the mobile number registered on your
              account. You can <a href={WHATSAPP_DELETE} target="_blank" rel="noopener noreferrer">tap here to open a pre-filled message</a>.
            </li>
          </ol>
          <p>
            Tell us whether you want the whole account deleted, or only specific documents (for example, bank
            statements from a completed filing). If you do not say, we treat it as a request for full deletion.
          </p>

          <h2>Identity verification</h2>
          <p>
            Deleting the wrong person&apos;s tax records would be a serious harm, so we verify every request before
            acting. The request must come from the registered email or the registered mobile number. We then send a
            one-time code to the other registered channel and ask you to confirm it. If you have lost access to
            both, we will ask for a masked copy of your PAN card and a short video selfie so that we can match your
            identity to the account. We never ask for passwords or portal OTPs as part of verification.
          </p>

          <h2>What gets deleted</h2>
          <p>Within 30 days of a verified request we permanently remove:</p>
          <ul>
            <li>Your login and profile: name, email, mobile number, address and saved preferences.</li>
            <li>All raw documents you uploaded: Form 16, bank statements, salary slips, invoices, capital gains reports, rent receipts, identity proofs and anything else in your document vault.</li>
            <li>Any portal credentials you shared with us for a task.</li>
            <li>Chat and support history linked to your account.</li>
            <li>Analytics identifiers we can tie to you, and your WhatsApp opt-in.</li>
            <li>Copies in backups, which are overwritten on the normal backup rotation within a further 30 days.</li>
          </ul>
          <p>
            Deletion is irreversible. If you have an order in progress, we will ask you to either let us finish it
            first or cancel it under the <a href="/cancellation-policy">Cancellation Policy</a>, because we cannot
            file a return whose documents have been deleted.
          </p>

          <h2>What we must keep, and why</h2>
          <p>Some records cannot be deleted on request because a law or a professional duty requires us to hold them:</p>
          <ul>
            <li>
              <strong>Filed returns and acknowledgements</strong> (ITR, GST, TDS), the final computation and the
              filing confirmation. Kept for eight years from the end of the relevant financial year. Tax authorities
              can reopen or query a return within this window and our panel members must be able to show the basis
              of what was filed. Professional conduct rules of ICMAI and ICAI also require working records to be
              retained.
            </li>
            <li>
              <strong>Tax invoices and payment records</strong> for our fees. Kept for eight years under GST and
              income tax record-keeping rules that apply to us as a business.
            </li>
            <li>
              <strong>The deletion request itself</strong> and our confirmation, kept as proof that we complied.
            </li>
          </ul>
          <p>
            These retained records are locked: they are removed from day-to-day systems, stored in an archive with
            restricted access, and used only if a regulator, court or tax authority requires them. They are not
            used for any other purpose and are destroyed when the retention period ends.
          </p>

          <h2>Timeline and confirmation</h2>
          <ul>
            <li>Day 0: request received. We acknowledge within 48 hours and start verification.</li>
            <li>Within 7 days: verification complete. If an order is in progress we ask how you want to handle it.</li>
            <li>Within 30 days of verification: deletion completed across live systems.</li>
            <li>You receive a written confirmation by email listing what was deleted and what was retained, with the retention end date for each item.</li>
          </ul>

          <h2>If you only want to leave</h2>
          <p>
            You do not need to delete your data to stop using the service. You can simply stop, and your documents
            stay encrypted in your vault for reuse next filing season. If you want to keep the account but remove
            older documents, ask for a partial deletion and list the files.
          </p>

          <h2>Complaints</h2>
          <p>
            If you believe a request was not handled correctly, write to our grievance officer at{' '}
            <a href={`mailto:${SITE.email}`}>{SITE.email}</a> with the subject &quot;Privacy grievance&quot;. Details
            of the grievance process and your other rights are in the <a href="/privacy-policy">Privacy Policy</a>.
          </p>
        </div>
      </Container>
    </>
  )
}
