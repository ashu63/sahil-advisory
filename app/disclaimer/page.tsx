import JsonLd from '@/app/components/JsonLd'
import { Breadcrumbs, Container } from '@/app/components/ui'
import { breadcrumbJsonLd, buildMetadata, graph, webPageJsonLd } from '@/app/lib/seo'
import { FOOTER_DISCLAIMER, SITE } from '@/app/lib/site'

const PAGE = {
  title: 'Disclaimer',
  path: '/disclaimer',
  description:
    'Sahil Advisory content and calculators are general information, not professional advice. How our panel works, who performs audits, and limits on what we say.',
} as const

const LAST_UPDATED = '6 September 2026'

export const metadata = buildMetadata({
  title: PAGE.title,
  description: PAGE.description,
  path: PAGE.path,
})

export default function DisclaimerPage() {
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
          <p>{FOOTER_DISCLAIMER}</p>

          <h2>General information, not advice</h2>
          <p>
            Articles, guides, FAQs, price pages and answers on this website are published to help you understand
            Indian tax and compliance in plain language. They describe the law as it generally applies and cannot
            take account of your income, residency, business structure or past filings. Nothing on the site is
            professional, legal, tax or investment advice, and you should not act on it without checking it against
            your own facts. Advice specific to you is given only by the expert assigned to your order, in writing,
            after reviewing your documents.
          </p>

          <h2>Calculators are estimates</h2>
          <p>
            Our income tax, HRA, capital gains, GST and other calculators use the rates and slabs we believe to be
            current on the date shown on each tool. They simplify some rules, ignore some deductions and cannot see
            the data on your Form 26AS or AIS. The result is an estimate for planning, not a computation you can
            file. Your actual liability is determined when a professional prepares your return and the department
            processes it.
          </p>

          <h2>Laws change</h2>
          <p>
            Tax law in India changes every year through the Finance Act, and often between budgets through
            notifications, circulars and court decisions. The Income-tax Act, 2025 replaces the 1961 Act from
            financial year {SITE.nextTaxYear}, and content written for earlier years may not reflect it. Each page
            shows when it was last updated. Check that date, and confirm the position with your assigned expert
            before relying on anything time-sensitive such as due dates, threshold limits or penalty amounts.
          </p>

          <h2>No engagement until you order</h2>
          <p>
            Reading the site, using a calculator, sending a WhatsApp message or requesting a callback does not
            create a professional engagement between you and {SITE.legalName} or any member of our panel. An
            engagement begins only when you place an order or book a paid consultation and we confirm it. Until
            then, we owe you no duty to act, to meet any deadline, or to keep track of your compliance calendar.
            Please do not send confidential documents before an order is confirmed.
          </p>

          <h2>Who we are, and who does the work</h2>
          <p>
            {SITE.name} is a brand and platform operated by {SITE.legalName}. It is not itself a firm of Cost
            Accountants or Chartered Accountants. Services are delivered by independent professionals on our panel,
            each of whom holds a current membership of the Institute of Cost Accountants of India (ICMAI), the
            Institute of Chartered Accountants of India (ICAI) or the Institute of Company Secretaries of India
            (ICSI). Their professional conduct, ethics and the standards of their work are governed by the rules of
            their respective institute, and any attestation they sign is signed in their own name and membership
            number.
          </p>
          <p>
            Tax audit under section 44AB, statutory audit, and any certificate or report that the law reserves for a
            Chartered Accountant is performed only by an empanelled Chartered Accountant holding a valid
            certificate of practice. Cost and Management Accountants on the panel prepare and file returns, handle
            GST and TDS compliance, prepare CMA data and project reports, and represent clients where the law
            permits. We will tell you which professional is assigned to your order and their qualification.
          </p>

          <h2>Accuracy and completeness</h2>
          <p>
            We take care to keep content correct, but we do not warrant that any page is complete, current or free
            of error. Figures such as the number of returns filed and customer ratings are taken from our own records
            and from public review platforms at the time of publishing. Prices shown exclude GST and may change;
            the price confirmed at checkout is the one that applies.
          </p>

          <h2>Third-party links and tools</h2>
          <p>
            The site links to government portals (Income Tax e-filing, GST, MCA, TRACES) and to other external
            websites for convenience. We do not control those sites and are not responsible for their content,
            availability or privacy practices. Embedded tools from analytics and messaging providers are covered in
            our <a href="/privacy-policy">Privacy Policy</a>.
          </p>

          <h2>Testimonials and results</h2>
          <p>
            Client reviews and case examples describe individual experiences. They are not a promise that you will
            receive the same refund, saving, turnaround or outcome. Every return depends on its own facts.
          </p>

          <h2>Limitation</h2>
          <p>
            To the extent permitted by law, {SITE.legalName} and its panel members are not liable for any loss
            arising from reliance on free content or calculators on this site. Liability for paid services is set
            out in our <a href="/terms">Terms of Service</a>. If you spot an error on any page, please tell us at{' '}
            <a href={`mailto:${SITE.email}`}>{SITE.email}</a> and we will correct it.
          </p>
        </div>
      </Container>
    </>
  )
}
