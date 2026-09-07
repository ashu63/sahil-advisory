import { index, integer, jsonb, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core'

// Lead status moves left to right. `lost` is terminal, `converted` means the
// person bought something (an order will point back to the lead in Phase 3).
export const LEAD_STATUSES = ['new', 'contacted', 'quoted', 'converted', 'lost'] as const
export type LeadStatus = (typeof LEAD_STATUSES)[number]

export const leads = pgTable(
  'leads',
  {
    id: uuid('id').defaultRandom().primaryKey(),

    // What the person told us.
    name: text('name').notNull(),
    phone: text('phone').notNull(),
    email: text('email'),
    // Free-text answer to the per-category question ("Salary / pension",
    // "Above ₹5 Cr", "Tax audit 44AB"...). Stored as text because the options
    // differ per category and change with the catalogue.
    detail: text('detail'),
    message: text('message'),

    // Which service page produced it.
    service: text('service'),
    sourceUrl: text('source_url'),

    // Attribution. utm is a loose bag so new parameters need no migration.
    referrer: text('referrer'),
    utm: jsonb('utm').$type<Record<string, string>>(),

    // Operations.
    status: text('status').$type<LeadStatus>().notNull().default('new'),
    notes: text('notes'),
    // How many times a notification was delivered for this lead. Lets us see
    // at a glance whether the WhatsApp or email hop is failing.
    notifiedCount: integer('notified_count').notNull().default(0),

    // Diagnostics. No PAN or Aadhaar is ever collected by this form.
    ip: text('ip'),
    userAgent: text('user_agent'),

    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    // The admin inbox reads newest-first, filtered by status.
    index('leads_created_at_idx').on(t.createdAt),
    index('leads_status_idx').on(t.status),
    index('leads_phone_idx').on(t.phone),
  ]
)

export type Lead = typeof leads.$inferSelect
export type NewLead = typeof leads.$inferInsert
