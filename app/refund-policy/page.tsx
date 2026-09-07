import JsonLd from '@/app/components/JsonLd'
import { Breadcrumbs, Container } from '@/app/components/ui'
import { breadcrumbJsonLd, buildMetadata, graph, webPageJsonLd } from '@/app/lib/seo'
import { SITE } from '@/app/lib/site'

const PAGE = {
  title: 'Refund Policy',
  path: '/refund-policy',
  description:
    'When Sahil Advisory refunds a service or consultation fee, how much you get back at each stage of the work, what is never refundable and how long refunds take.',
} as const

const LAST_UPDATED = '6 September 2026'

export const metadata = buildMetadata({
  title: PAGE.title,
  description: PAGE.description,
  path: PAGE.path,
})

const STAGES = [
  { stage: 'We cannot file because of our fault', refund: '100% of the fee' },
  { stage: 'Cancelled before an expert is assigned or documents reviewed', refund: '100% of the fee' },
  { stage: 'Cancelled after work starts but before a draft is shared', refund: '75% of the fee' },
  { stage: 'Cancelled after a draft return or computation is shared', refund: '50% of the fee' },
  { stage: 'After the return, application or reply has been filed', refund: 'No refund' },
] as const

export default function RefundPolicyPage() {
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
            We charge fixed prices and we want the refund rules to be just as clear. This policy tells you exactly
            what you get back depending on how far your order has progressed. It applies to every service bought on
            {' '}{SITE.name}, including ITR filing, GST and TDS returns, registrations, notice replies and paid
            consultations.
          </p>

          <h2>Service orders</h2>
          <p>Refunds on a service order depend on the stage of work at the time you cancel:</p>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="border-b border-border text-left">
                  <th className="py-2 pr-4 font-semibold text-navy-900">Stage of the order</th>
                  <th className="py-2 font-semibold text-navy-900">Refund</th>
                </tr>
              </thead>
              <tbody>
                {STAGES.map((s) => (
                  <tr key={s.stage} className="border-b border-border">
                    <td className="py-2 pr-4 text-text-2">{s.stage}</td>
                    <td className="py-2 font-medium text-navy-900">{s.refund}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p>
            &quot;Our fault&quot; means we could not complete the filing for a reason within our control, such as an
            expert not being available, an error on our side that cannot be corrected in time, or a service we
            listed but cannot actually deliver for your case. It does not include missing or wrong information from
            you, portal outages, or a change in your mind after the draft is ready.
          </p>
          <p>
            Work &quot;starts&quot; when an expert is assigned to your order or begins reviewing your documents,
            whichever comes first. You can see this status in your order timeline.
          </p>

          <h2>Consultations</h2>
          <ul>
            <li>If we cancel a booked consultation, the fee is refunded in full.</li>
            <li>If no expert joins the call within 15 minutes of the booked time, the fee is refunded in full.</li>
            <li>If you cancel or miss the slot, the fee is not refunded in cash, but it is held as a credit that you can adjust against any service purchased within 30 days.</li>
            <li>Rescheduling is free up to 4 hours before the slot; see the <a href="/cancellation-policy">Cancellation Policy</a>.</li>
          </ul>

          <h2>What is never refundable</h2>
          <ul>
            <li>Government fees, challans, late fees, interest and penalties paid to any authority on your behalf.</li>
            <li>Stamp duty, DSC (digital signature) token costs and notary charges.</li>
            <li>GST charged on our fee, except where the underlying fee is refunded, in which case a credit note is issued and GST is refunded with it.</li>
            <li>Fees for work already filed or submitted with a government portal.</li>
          </ul>

          <h2>Corrections are free</h2>
          <p>
            If we made a mistake in a filing, the fix is on us. We prepare and file the revised or rectified return
            at no extra charge. A refund is not the remedy for an error we can correct, but if we cannot correct it,
            the 100% rule above applies.
          </p>

          <h2>Refund timeline</h2>
          <p>
            Approved refunds are processed within 5 to 7 working days to the original payment method (card, UPI,
            net banking or wallet). Your bank or card issuer may take a further 2 to 5 working days to show the
            amount. We do not refund to a different account than the one you paid from, except where the original
            method is closed and you provide proof.
          </p>

          <h2>How to request a refund</h2>
          <ol>
            <li>Email <a href={`mailto:${SITE.email}`}>{SITE.email}</a> from your registered email address, or message us on WhatsApp at {SITE.phoneDisplay}.</li>
            <li>Use the subject &quot;Refund request&quot; and include your order ID and the reason.</li>
            <li>We confirm the stage of your order and the refund amount within 2 working days.</li>
            <li>Once you accept, the refund is initiated and you receive a reference number.</li>
          </ol>

          <h2>Disputes</h2>
          <p>
            If you disagree with the stage we have recorded or with the amount, reply to the confirmation and a
            senior member of the team will review the order history, including timestamps of assignment, document
            review and draft sharing. Our decision after that review is final, subject to your rights under Indian
            consumer law.
          </p>
        </div>
      </Container>
    </>
  )
}
