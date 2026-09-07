'use client'

// Renders FAQPage JSON-LD from the CLIENT bundle.
//
// When a server component renders <script type="application/ld+json"> with
// FAQPage data, Next.js also serialises that script into the RSC flight
// payload. Google's structured-data parser reads the escaped copy as a second
// FAQPage and reports 'Duplicate field "FAQPage"', invalidating the rich
// result. As a client component only the plain {q, a} strings cross the RSC
// boundary; the schema is built in the browser bundle so it appears once.
//
// Contract: pass plain question/answer pairs, never a pre-built schema object.
export default function FaqJsonLd({ faqs }: { faqs: { q: string; a: string }[] }) {
  if (!faqs?.length) return null
  const data = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  }
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}
