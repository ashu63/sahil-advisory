import { and, count, desc, eq, gte, ilike, or, sql } from 'drizzle-orm'
import { db, leads, leadActivities, notifications, users, LEAD_STATUSES, type LeadStatus } from '@/app/lib/db'

// Read-side helpers for the admin inbox. Every function tolerates a missing
// database by returning empty results, so the admin shell still renders with
// its "not configured" banner instead of crashing.

export type LeadFilters = {
  status?: LeadStatus | 'all'
  q?: string
  page?: number
  pageSize?: number
}

export async function listLeads(filters: LeadFilters = {}) {
  if (!db) return { rows: [], total: 0, page: 1, pageSize: 25 }
  const page = Math.max(1, filters.page ?? 1)
  const pageSize = Math.min(100, Math.max(10, filters.pageSize ?? 25))
  const conds = []
  if (filters.status && filters.status !== 'all' && (LEAD_STATUSES as readonly string[]).includes(filters.status)) {
    conds.push(eq(leads.status, filters.status))
  }
  if (filters.q) {
    const term = `%${filters.q.trim()}%`
    conds.push(or(ilike(leads.name, term), ilike(leads.phone, term), ilike(leads.service, term), ilike(leads.email, term)))
  }
  const where = conds.length ? and(...conds) : undefined
  const [rows, [{ total }]] = await Promise.all([
    db
      .select({
        id: leads.id,
        name: leads.name,
        phone: leads.phone,
        service: leads.service,
        detail: leads.detail,
        status: leads.status,
        notifiedCount: leads.notifiedCount,
        createdAt: leads.createdAt,
        utm: leads.utm,
        ownerName: users.name,
        ownerEmail: users.email,
      })
      .from(leads)
      .leftJoin(users, eq(leads.ownerId, users.id))
      .where(where)
      .orderBy(desc(leads.createdAt))
      .limit(pageSize)
      .offset((page - 1) * pageSize),
    db.select({ total: count() }).from(leads).where(where),
  ])
  return { rows, total: Number(total), page, pageSize }
}

export async function getLead(id: string) {
  if (!db) return null
  const [lead] = await db.select().from(leads).where(eq(leads.id, id)).limit(1)
  if (!lead) return null
  const [activities, sent, owner] = await Promise.all([
    db
      .select({
        id: leadActivities.id,
        type: leadActivities.type,
        fromStatus: leadActivities.fromStatus,
        toStatus: leadActivities.toStatus,
        body: leadActivities.body,
        createdAt: leadActivities.createdAt,
        actorName: users.name,
        actorEmail: users.email,
      })
      .from(leadActivities)
      .leftJoin(users, eq(leadActivities.actorId, users.id))
      .where(eq(leadActivities.leadId, id))
      .orderBy(desc(leadActivities.createdAt)),
    db.select().from(notifications).where(eq(notifications.leadId, id)).orderBy(desc(notifications.createdAt)),
    lead.ownerId ? db.select({ id: users.id, name: users.name, email: users.email }).from(users).where(eq(users.id, lead.ownerId)).limit(1) : Promise.resolve([]),
  ])
  return { lead, activities, notifications: sent, owner: owner[0] ?? null }
}

export async function leadStats() {
  if (!db) return { byStatus: {} as Record<string, number>, last7: 0, last30: 0, topServices: [] as { service: string | null; n: number }[], topSources: [] as { source: string; n: number }[] }
  const now = Date.now()
  const d7 = new Date(now - 7 * 86_400_000)
  const d30 = new Date(now - 30 * 86_400_000)
  const [byStatusRows, [{ last7 }], [{ last30 }], topServices, topSources] = await Promise.all([
    db.select({ status: leads.status, n: count() }).from(leads).groupBy(leads.status),
    db.select({ last7: count() }).from(leads).where(gte(leads.createdAt, d7)),
    db.select({ last30: count() }).from(leads).where(gte(leads.createdAt, d30)),
    db.select({ service: leads.service, n: count() }).from(leads).where(gte(leads.createdAt, d30)).groupBy(leads.service).orderBy(desc(count())).limit(6),
    db
      .select({ source: sql<string>`coalesce(${leads.utm} ->> 'utm_source', 'direct')`, n: count() })
      .from(leads)
      .where(gte(leads.createdAt, d30))
      .groupBy(sql`coalesce(${leads.utm} ->> 'utm_source', 'direct')`)
      .orderBy(desc(count()))
      .limit(6),
  ])
  const byStatus: Record<string, number> = {}
  for (const r of byStatusRows) byStatus[r.status] = Number(r.n)
  return { byStatus, last7: Number(last7), last30: Number(last30), topServices: topServices.map((r) => ({ ...r, n: Number(r.n) })), topSources: topSources.map((r) => ({ ...r, n: Number(r.n) })) }
}

export async function listAdmins() {
  if (!db) return []
  return db.select({ id: users.id, name: users.name, email: users.email }).from(users).where(eq(users.role, 'admin'))
}
