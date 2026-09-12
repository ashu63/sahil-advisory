'use client'

import { useState, useTransition } from 'react'
import { Loader2 } from 'lucide-react'
import { updateLeadStatus, addLeadNote, assignLead } from '@/app/lib/leads/actions'
import type { LeadStatus } from '@/app/lib/db'

type Admin = { id: string; name: string | null; email: string | null }

export function LeadControls({ leadId, status, statuses, ownerId, admins }: { leadId: string; status: LeadStatus; statuses: readonly LeadStatus[]; ownerId: string | null; admins: Admin[] }) {
  const [pending, start] = useTransition()
  const [noteType, setNoteType] = useState<'note' | 'call' | 'whatsapp' | 'email'>('call')

  return (
    <div className="mt-4 space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-semibold text-text-2">Status</span>
        {statuses.map((s) => (
          <button
            key={s}
            type="button"
            disabled={pending || s === status}
            onClick={() => start(() => { void updateLeadStatus(leadId, s) })}
            className={`rounded-lg px-3 py-1.5 text-xs font-bold uppercase tracking-wider ${s === status ? 'bg-navy-900 text-white' : 'bg-bg-alt text-navy-900 hover:bg-navy-100'} disabled:opacity-60`}
          >
            {s}
          </button>
        ))}
        <label className="ml-auto flex items-center gap-2 text-xs font-semibold text-text-2">
          Owner
          <select
            defaultValue={ownerId ?? ''}
            disabled={pending}
            onChange={(e) => start(() => { void assignLead(leadId, e.target.value || null) })}
            className="rounded-lg border border-border-strong bg-white px-2 py-1.5 text-xs font-normal outline-none"
          >
            <option value="">Unassigned</option>
            {admins.map((a) => (
              <option key={a.id} value={a.id}>{a.name ?? a.email}</option>
            ))}
          </select>
        </label>
      </div>

      <form
        action={(fd) => start(async () => { await addLeadNote(leadId, fd); (document.getElementById('lead-note') as HTMLTextAreaElement | null)?.form?.reset() })}
        className="rounded-xl border border-border bg-bg-alt p-3"
      >
        <div className="flex flex-wrap items-center gap-1">
          {(['call', 'whatsapp', 'email', 'note'] as const).map((t) => (
            <label key={t} className={`cursor-pointer rounded-md px-2.5 py-1 text-xs font-semibold capitalize ${noteType === t ? 'bg-navy-900 text-white' : 'bg-white text-navy-900 ring-1 ring-border'}`}>
              <input type="radio" name="type" value={t} checked={noteType === t} onChange={() => setNoteType(t)} className="sr-only" />
              {t === 'note' ? 'Note' : `Logged ${t}`}
            </label>
          ))}
        </div>
        <textarea id="lead-note" name="body" required rows={2} placeholder={noteType === 'call' ? 'What was said, and the next step' : 'Add a note'} className="mt-2 w-full rounded-lg border border-border-strong bg-white px-3 py-2 text-sm outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100" />
        <div className="mt-2 flex justify-end">
          <button type="submit" disabled={pending} className="inline-flex items-center gap-2 rounded-lg bg-green-600 px-3 py-1.5 text-sm font-semibold text-white hover:bg-green-700 disabled:opacity-60">
            {pending && <Loader2 className="h-3.5 w-3.5 animate-spin" />} Save
          </button>
        </div>
      </form>
    </div>
  )
}
