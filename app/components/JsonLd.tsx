// Server-side JSON-LD. Do NOT put FAQPage in here; use FaqJsonLd (client)
// to avoid the duplicate-FAQPage bug caused by RSC payload serialisation.
export default function JsonLd({ data }: { data: unknown }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}
