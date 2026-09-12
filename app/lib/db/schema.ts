import { boolean, index, integer, jsonb, pgTable, primaryKey, text, timestamp, uuid } from 'drizzle-orm/pg-core'
import type { AdapterAccountType } from 'next-auth/adapters'

// ───────────────────────────────────────────────────────────────────────────
// Auth.js tables. Column names follow what @auth/drizzle-adapter expects, so
// the adapter needs no mapping beyond the table objects. Our own columns
// (role, phone, whatsappOptIn) sit alongside on `users`.
// ───────────────────────────────────────────────────────────────────────────

export const USER_ROLES = ['client', 'expert', 'admin'] as const
export type UserRole = (typeof USER_ROLES)[number]

export const users = pgTable('users', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text('name'),
  email: text('email').unique(),
  emailVerified: timestamp('email_verified', { mode: 'date' }),
  image: text('image'),
  // Ours.
  role: text('role').$type<UserRole>().notNull().default('client'),
  phone: text('phone'),
  whatsappOptIn: boolean('whatsapp_opt_in').notNull().default(false),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
})

export const accounts = pgTable(
  'accounts',
  {
    userId: text('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    type: text('type').$type<AdapterAccountType>().notNull(),
    provider: text('provider').notNull(),
    providerAccountId: text('provider_account_id').notNull(),
    refresh_token: text('refresh_token'),
    access_token: text('access_token'),
    expires_at: integer('expires_at'),
    token_type: text('token_type'),
    scope: text('scope'),
    id_token: text('id_token'),
    session_state: text('session_state'),
  },
  (t) => [primaryKey({ columns: [t.provider, t.providerAccountId] })]
)

// Present for the adapter's sake; sessions use the JWT strategy so this table
// stays empty. Keeping it means switching strategies later is a config change.
export const sessions = pgTable('sessions', {
  sessionToken: text('session_token').primaryKey(),
  userId: text('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  expires: timestamp('expires', { mode: 'date' }).notNull(),
})

// Magic-link tokens. A row is written when a link is emailed and deleted when
// it is used, so this table is small and self-cleaning.
export const verificationTokens = pgTable(
  'verification_tokens',
  {
    identifier: text('identifier').notNull(),
    token: text('token').notNull(),
    expires: timestamp('expires', { mode: 'date' }).notNull(),
  },
  (t) => [primaryKey({ columns: [t.identifier, t.token] })]
)

// ───────────────────────────────────────────────────────────────────────────
// Leads
// ───────────────────────────────────────────────────────────────────────────

export const LEAD_STATUSES = ['new', 'contacted', 'quoted', 'converted', 'lost'] as const
export type LeadStatus = (typeof LEAD_STATUSES)[number]

export const leads = pgTable(
  'leads',
  {
    id: uuid('id').defaultRandom().primaryKey(),

    name: text('name').notNull(),
    phone: text('phone').notNull(),
    email: text('email'),
    // Free-text answer to the per-category question. Options differ by
    // category and change with the catalogue, so this is not an enum.
    detail: text('detail'),
    message: text('message'),

    service: text('service'),
    sourceUrl: text('source_url'),
    referrer: text('referrer'),
    utm: jsonb('utm').$type<Record<string, string>>(),

    status: text('status').$type<LeadStatus>().notNull().default('new'),
    notes: text('notes'),
    // Which team member owns the follow-up. Null until someone claims it.
    ownerId: text('owner_id').references(() => users.id, { onDelete: 'set null' }),
    // Delivered-alert counter, kept for a fast "was anyone told?" check. The
    // per-attempt detail lives in `notifications`.
    notifiedCount: integer('notified_count').notNull().default(0),

    ip: text('ip'),
    userAgent: text('user_agent'),

    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    index('leads_created_at_idx').on(t.createdAt),
    index('leads_status_idx').on(t.status),
    index('leads_phone_idx').on(t.phone),
  ]
)

// Everything that happens to a lead after it arrives: status changes, notes,
// calls logged, WhatsApp replies. Append-only, so the inbox shows a complete
// history and nothing is lost when a note is edited.
export const LEAD_ACTIVITY_TYPES = ['status_change', 'note', 'call', 'whatsapp', 'email', 'assigned'] as const
export type LeadActivityType = (typeof LEAD_ACTIVITY_TYPES)[number]

export const leadActivities = pgTable(
  'lead_activities',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    leadId: uuid('lead_id')
      .notNull()
      .references(() => leads.id, { onDelete: 'cascade' }),
    // Null when the system did it (for example the initial alert).
    actorId: text('actor_id').references(() => users.id, { onDelete: 'set null' }),
    type: text('type').$type<LeadActivityType>().notNull(),
    fromStatus: text('from_status').$type<LeadStatus>(),
    toStatus: text('to_status').$type<LeadStatus>(),
    body: text('body'),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index('lead_activities_lead_id_idx').on(t.leadId, t.createdAt)]
)

// ───────────────────────────────────────────────────────────────────────────
// Outbound messages: one row per attempt, per channel. This is the answer to
// "did the WhatsApp go out, and if not, why?" without opening Vercel logs.
// ───────────────────────────────────────────────────────────────────────────

export const NOTIFICATION_CHANNELS = ['email', 'whatsapp'] as const
export type NotificationChannel = (typeof NOTIFICATION_CHANNELS)[number]
export const NOTIFICATION_STATUSES = ['sent', 'failed', 'skipped'] as const
export type NotificationStatus = (typeof NOTIFICATION_STATUSES)[number]

export const notifications = pgTable(
  'notifications',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    leadId: uuid('lead_id').references(() => leads.id, { onDelete: 'cascade' }),
    userId: text('user_id').references(() => users.id, { onDelete: 'set null' }),
    channel: text('channel').$type<NotificationChannel>().notNull(),
    // 'resend', 'meta', 'webhook'... whatever actually carried it.
    provider: text('provider'),
    // What kind of message: 'lead_alert' today; 'order_paid', 'draft_ready'
    // and so on later.
    kind: text('kind').notNull(),
    to: text('to').notNull(),
    // Subject for email, template name for WhatsApp.
    subject: text('subject'),
    body: text('body'),
    status: text('status').$type<NotificationStatus>().notNull(),
    // Provider's own id, useful when chasing delivery with their support.
    providerMessageId: text('provider_message_id'),
    error: text('error'),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index('notifications_lead_id_idx').on(t.leadId), index('notifications_created_at_idx').on(t.createdAt)]
)

export type Lead = typeof leads.$inferSelect
export type NewLead = typeof leads.$inferInsert
export type LeadActivity = typeof leadActivities.$inferSelect
export type Notification = typeof notifications.$inferSelect
export type User = typeof users.$inferSelect
