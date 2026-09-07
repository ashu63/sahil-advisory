import Link from 'next/link'
import { Container, Button } from '@/app/components/ui'
import { LIVE_CALCULATORS } from '@/app/lib/calculators'

export default function NotFound() {
  return (
    <Container className="py-24 text-center">
      <p className="font-mono text-sm font-bold uppercase tracking-widest text-green-700">404</p>
      <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-navy-900 sm:text-4xl">That page does not exist</h1>
      <p className="mx-auto mt-4 max-w-md text-text-2">The link may be old or mistyped. Here is where most people want to go.</p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Button href="/services" icon>Services</Button>
        <Button href="/pricing" variant="secondary">Pricing</Button>
        <Button href="/guides" variant="secondary">Guides</Button>
      </div>
      <p className="mt-10 text-sm text-muted">
        Or try a calculator: {LIVE_CALCULATORS.slice(0, 4).map((c, i) => (<span key={c.slug}>{i > 0 && ' · '}<Link href={`/calculators/${c.slug}`} className="font-semibold text-green-700 hover:underline">{c.name}</Link></span>))}
      </p>
    </Container>
  )
}
