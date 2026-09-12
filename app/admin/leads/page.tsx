import Link from 'next/link'
import { Search } from 'lucide-react'
import { listLeads } from '@/app/lib/leads/queries'
import { LEAD_STATUSES, type LeadStatus } from '@/app/lib/db'
import { formatDateIN } from '@/app/lib/format'
import { StatusBadge } from './StatusBadge'

type Search = Promise<{ status?: string; q?: string; page?: string }>

export default async function LeadsInbox({ searchParams }: { searchParams: Search }) {
  const sp = await searchParams
  const status = (sp.status && (LEAD_STATUSES as readonly string[]).includes(sp.status) ? sp.status : 'all') as LeadStatus | 'all'
  const q = sp.q?.trim() || ''
  const page = Math.max(1, Number(sp.page) || 1)
  const { rows, total, pageSize } = await listLeads({ status, q, page })
  const pages = Math.max(1, Math.ceil(total / pageSize))
  const href = (over: Record<string, string | number | undefined>) => {
    const p = new URLSearchParams()
    const merged = { status, q, page, ...over }
    for (const [k, v] of Object.entries(merged)) if (v && v !== 'all' && !(k === 'page' && v === 1)) p.set(k, String(v))
    const s = p.toString()
    return `/admin/leads${s ? `?${s}` : ''}`
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-navy-900">Leads</h1>
          <p className="mt-1 text-sm text-text-2">{total} {status === 'all' ? 'total' : status}{q ? ` matching "${q}"` : ''}.</p>
        </div>
        <form className="flex gap-2" action="/admin/leads" method="get">
          {status !== 'all' && <input type="hidden" name="status" value={status} />}
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
            <input name="q" defaultValue={q} placeholder="Name, phone, service" className="w-64 rounded-lg border border-border-strong bg-white py-2 pl-9 pr-3 text-sm outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100" />
          </div>
          <button type="submit" className="rounded-lg bg-navy-900 px-3 py-2 text-sm font-semibold text-white hover:bg-navy-800">Search</button>
        </form>
      </div>

      <nav className="flex flex-wrap gap-1" aria-label="Filter by status">
        {(['all', ...LEAD_STATUSES] as const).map((s) => (
          <Link key={s} href={href({ status: s, page: 1 })} className={`rounded-lg px-3 py-1.5 text-sm font-semibold ${status === s ? 'bg-navy-900 text-white' : 'bg-white text-navy-900 ring-1 ring-border hover:bg-bg-alt'}`}>
            {s === 'all' ? 'All' : s.charAt(0).toUpperCase() + s.slice(1)}
          </Link>
        ))}
      </nav>

      <div className="overflow-x-auto rounded-2xl border border-border bg-card">
        <table className="w-full min-w-[820px] text-sm">
          <thead className="bg-bg-alt text-left text-xs font-bold uppercase tracking-wider text-muted">
            <tr>
              <th className="px-4 py-3">Lead</th>
              <th className="px-4 py-3">Service</th>
              <th className="px-4 py-3">Source</th>
              <th className="px-4 py-3">Owner</th>
              <th className="px-4 py-3">Alerted</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Received</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {rows.length === 0 && (
              <tr><td colSpan={7} className="px-4 py-10 text-center text-muted">No leads match.</td></tr>
            )}
            {rows.map((l) => (
              <tr key={l.id} className="hover:bg-bg-alt/60">
                <td className="px-4 py-3">
                  <Link href={`/admin/leads/${l.id}`} className="font-semibold text-navy-900 hover:text-green-700">{l.name}</Link>
                  <span className="block font-mono text-xs text-text-2">+91 {l.phone}</span>
                </td>
                <td className="px-4 py-3 text-text-2">{l.service ?? 'General'}{l.detail ? <span className="block text-xs text-muted">{l.detail}</span> : null}</td>
                <td className="px-4 py-3 text-xs text-text-2">{l.utm?.utm_source ?? 'direct'}{l.utm?.utm_campaign ? <span className="block text-muted">{l.utm.utm_campaign}</span> : null}</td>
                <td className="px-4 py-3 text-xs text-text-2">{l.ownerName ?? l.ownerEmail ?? <span className="text-muted">Unassigned</span>}</td>
                <td className="px-4 py-3 font-mono text-xs tabular">{l.notifiedCount > 0 ? <span className="text-green-700">yes</span> : <span className="text-red-600">no</span>}</td>
                <td className="px-4 py-3"><StatusBadge status={l.status} /></td>
                <td className="px-4 py-3 font-mono text-xs text-text-2">{formatDateIN(l.createdAt)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {pages > 1 && (
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted">Page {page} of {pages}</span>
          <div className="flex gap-2">
            {page > 1 && <Link href={href({ page: page - 1 })} className="rounded-lg bg-white px-3 py-1.5 font-semibold text-navy-900 ring-1 ring-border hover:bg-bg-alt">Previous</Link>}
            {page < pages && <Link href={href({ page: page + 1 })} className="rounded-lg bg-white px-3 py-1.5 font-semibold text-navy-900 ring-1 ring-border hover:bg-bg-alt">Next</Link>}
          </div>
        </div>
      )}
    </div>
  )
}
