import type { LeadStatus } from '@/app/lib/db'

const TONES: Record<LeadStatus, string> = {
  new: 'bg-red-50 text-red-600 border-red-100',
  contacted: 'bg-navy-100 text-navy-900 border-navy-100',
  quoted: 'bg-gold-50 text-gold-600 border-amber-200',
  converted: 'bg-green-50 text-green-700 border-green-100',
  lost: 'bg-bg-alt text-muted border-border',
}

export function StatusBadge({ status }: { status: LeadStatus }) {
  return <span className={`inline-flex rounded-md border px-2 py-0.5 text-[11px] font-bold uppercase tracking-wider ${TONES[status]}`}>{status}</span>
}
