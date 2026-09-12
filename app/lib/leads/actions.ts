'use server'

import { revalidatePath } from 'next/cache'
import { eq } from 'drizzle-orm'
import { requireAdmin } from '@/app/lib/auth-guard'
import { db, leads, leadActivities, LEAD_STATUSES, type LeadStatus } from '@/app/lib/db'

// Every action re-checks the admin role. Server actions are public HTTP
// endpoints; a check in the page that renders the form protects nothing.

function isStatus(v: unknown): v is LeadStatus {
  return typeof v === 'string' && (LEAD_STATUSES as readonly string[]).includes(v)
}

export async function updateLeadStatus(leadId: string, next: string) {
  const user = await requireAdmin()
  if (!db || !isStatus(next)) return { ok: false }
  const [current] = await db.select({ status: leads.status }).from(leads).where(eq(leads.id, leadId)).limit(1)
  if (!current || current.status === next) return { ok: true }
  await db.transaction(async (tx) => {
    await tx.update(leads).set({ status: next, updatedAt: new Date() }).where(eq(leads.id, leadId))
    await tx.insert(leadActivities).values({ leadId, actorId: user.id, type: 'status_change', fromStatus: current.status, toStatus: next })
  })
  revalidatePath('/admin/leads')
  revalidatePath(`/admin/leads/${leadId}`)
  return { ok: true }
}

export async function addLeadNote(leadId: string, formData: FormData) {
  const user = await requireAdmin()
  if (!db) return { ok: false }
  const body = String(formData.get('body') || '').trim().slice(0, 2000)
  const type = String(formData.get('type') || 'note')
  if (!body) return { ok: false }
  const kind = (['note', 'call', 'whatsapp', 'email'] as const).includes(type as 'note') ? (type as 'note' | 'call' | 'whatsapp' | 'email') : 'note'
  await db.transaction(async (tx) => {
    await tx.insert(leadActivities).values({ leadId, actorId: user.id, type: kind, body })
    await tx.update(leads).set({ updatedAt: new Date() }).where(eq(leads.id, leadId))
  })
  revalidatePath(`/admin/leads/${leadId}`)
  return { ok: true }
}

export async function assignLead(leadId: string, ownerId: string | null) {
  const user = await requireAdmin()
  if (!db) return { ok: false }
  await db.transaction(async (tx) => {
    await tx.update(leads).set({ ownerId, updatedAt: new Date() }).where(eq(leads.id, leadId))
    await tx.insert(leadActivities).values({ leadId, actorId: user.id, type: 'assigned', body: ownerId ? `Assigned to ${ownerId === user.id ? 'self' : ownerId}` : 'Unassigned' })
  })
  revalidatePath('/admin/leads')
  revalidatePath(`/admin/leads/${leadId}`)
  return { ok: true }
}
