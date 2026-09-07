import { Check, FileCheck2, MessageCircle } from 'lucide-react'

// A "live status" mockup rather than a stock illustration: it shows the
// product promise (assigned expert, document checklist, draft approval,
// WhatsApp update) in one glance.
export default function HeroStatusCard() {
  const rows = [
    { label: 'Service', value: 'ITR-2 with capital gains', done: true },
    { label: 'Expert', value: 'CMA Sahil, assigned', done: true },
    { label: 'Documents', value: '6 / 6 received', done: true },
    { label: 'Draft computation', value: 'Shared for your approval', done: false },
  ]
  return (
    <div className="relative mx-auto w-full max-w-sm">
      <div className="rounded-3xl border border-border bg-card p-5 shadow-[var(--shadow-lift)]">
        <div className="flex items-center justify-between">
          <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-muted">Order #SA-2611</p>
          <span className="rounded-md bg-green-50 px-2 py-0.5 text-[11px] font-bold text-green-700">In progress</span>
        </div>
        <div className="mt-4 flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-full bg-green-600 text-white">
            <FileCheck2 className="h-5 w-5" />
          </span>
          <div>
            <p className="text-base font-bold text-navy-900">Your filing is in motion</p>
            <p className="text-xs text-muted">Refund estimate <span className="font-mono font-semibold text-green-700">₹18,340</span></p>
          </div>
        </div>
        <ul className="mt-4 space-y-2">
          {rows.map((r) => (
            <li key={r.label} className="flex items-center justify-between rounded-xl border border-border bg-bg-alt px-3 py-2.5 text-sm">
              <span className="text-muted">{r.label}</span>
              <span className="flex items-center gap-1.5 font-semibold text-navy-900">
                {r.value}
                {r.done ? (
                  <Check className="h-4 w-4 text-green-600" />
                ) : (
                  <span className="h-2 w-2 animate-pulse rounded-full bg-gold-600" />
                )}
              </span>
            </li>
          ))}
        </ul>
        <button type="button" className="mt-4 w-full rounded-lg bg-navy-900 py-2.5 text-sm font-semibold text-white" tabIndex={-1} aria-hidden>
          Approve draft and file
        </button>
      </div>
      <div className="absolute -bottom-5 -left-4 flex items-center gap-2 rounded-xl border border-border bg-white px-3 py-2 text-xs shadow-[var(--shadow-lift)] sm:-left-8">
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#25D366] text-white"><MessageCircle className="h-4 w-4" /></span>
        <span>
          <span className="block font-semibold text-navy-900">WhatsApp update</span>
          <span className="block text-muted">Draft ready. Reply APPROVE to file.</span>
        </span>
      </div>
    </div>
  )
}
