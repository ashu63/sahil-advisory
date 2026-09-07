import JsonLd from '@/app/components/JsonLd'
import { Breadcrumbs, Container } from '@/app/components/ui'
import { breadcrumbJsonLd, buildMetadata, graph, webPageJsonLd } from '@/app/lib/seo'
import { SITE } from '@/app/lib/site'

const PAGE = {
  title: 'Cancellation Policy',
  path: '/cancellation-policy',
  description:
    'How to cancel or reschedule a Sahil Advisory order, consultation or monthly GST retainer, the cutoff times that apply, and what happens to your documents.',
} as const

const LAST_UPDATED = '6 September 2026'

export const metadata = buildMetadata({
  title: PAGE.title,
  description: PAGE.description,
  path: PAGE.path,
})

export default function CancellationPolicyPage() {
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
            Plans change. This page explains how to cancel a service order, a consultation or a monthly retainer
            with {SITE.name}, the cutoffs that apply, and what happens to the documents you have shared. The money
            side of a cancellation is covered in the <a href="/refund-policy">Refund Policy</a>; this page covers
            the process.
          </p>

          <h2>How to cancel</h2>
          <p>You can cancel through any of these channels. Cancellation takes effect from the time we receive it:</p>
          <ul>
            <li>From your account: open the order and choose &quot;Cancel order&quot; or &quot;Cancel booking&quot;.</li>
            <li>By email: write to <a href={`mailto:${SITE.email}`}>{SITE.email}</a> from your registered email with the subject &quot;Cancel order&quot; and your order ID.</li>
            <li>On WhatsApp: message {SITE.phoneDisplay} from your registered number with your order ID.</li>
          </ul>
          <p>
            We confirm the cancellation, the stage the order had reached and any refund due within one working day.
            Requests sent outside working hours ({SITE.hours}) are treated as received at the start of the next
            working day for turnaround purposes, but the timestamp of your message is what decides the refund stage.
          </p>

          <h2>Service orders</h2>
          <p>
            A service order (ITR, GST return, TDS return, registration, notice reply and similar) can be cancelled
            at any time before it is filed. What you get back depends on how far the work has progressed:
          </p>
          <ul>
            <li>Before an expert is assigned or your documents are reviewed: cancel freely, full refund.</li>
            <li>After work has started: partial refund as set out in the Refund Policy.</li>
            <li>After filing with a government portal: the order cannot be cancelled because the work is complete.</li>
          </ul>
          <p>
            If you cancel because we have missed our own turnaround estimate by more than 5 working days without a
            reason on your side, we treat it as a cancellation before work started and refund in full.
          </p>

          <h2>Consultations</h2>
          <ul>
            <li>Reschedule free of charge up to 4 hours before the booked slot, as many times as you need within 30 days of the original booking.</li>
            <li>Rescheduling inside the 4-hour window counts as a missed slot, and the fee is held as a credit usable on any service within 30 days.</li>
            <li>Cancel up to 4 hours before the slot and the fee is held as a credit for 30 days.</li>
            <li>If we cancel, or no expert joins within 15 minutes of the start time, you may choose a full refund or a fresh slot.</li>
            <li>A consultation that has taken place cannot be cancelled.</li>
          </ul>

          <h2>Monthly retainer plans (GST and bookkeeping)</h2>
          <p>
            Retainer plans such as monthly GST return filing are billed month to month. You can cancel at any time
            by giving 15 days written notice by email or WhatsApp. During the notice period we complete any return
            whose due date falls inside it, so you are never left with an unfiled period. Fees for the month in
            which notice is given are payable in full; no fee is charged for later months. If you have paid in
            advance for a quarter or year, the unused whole months are refunded.
          </p>
          <p>
            We may also end a retainer with 15 days notice, for example if documents are repeatedly not provided in
            time to file. We will file everything due within the notice period before the plan ends.
          </p>

          <h2>What happens to your documents</h2>
          <ul>
            <li>Documents uploaded for a cancelled order stay in your account so you can reuse them later, unless you ask us to delete them.</li>
            <li>If you want them removed, follow the steps on the <a href="/data-deletion">data deletion page</a>. Deletion is completed within 30 days.</li>
            <li>Where a filing was completed before cancellation of a retainer, we keep the filed return, acknowledgement and invoice for eight years as a professional record, as explained in the <a href="/privacy-policy">Privacy Policy</a>.</li>
            <li>Portal credentials shared for a cancelled task are removed from our systems as soon as the cancellation is confirmed. We recommend that you also change the password.</li>
          </ul>

          <h2>Cancellation by us</h2>
          <p>
            We may cancel an order if we find that we cannot deliver the service for your case, if the information
            given to us appears false, or if payment fails. In every case where we cancel before filing, you receive
            a full refund of the fee paid, and we tell you the reason in writing.
          </p>

          <h2>Questions</h2>
          <p>
            If anything here is unclear, message us on WhatsApp or email <a href={`mailto:${SITE.email}`}>{SITE.email}</a>{' '}
            before you cancel. Often a reschedule or a scope change solves the problem without cancelling at all.
          </p>
        </div>
      </Container>
    </>
  )
}
