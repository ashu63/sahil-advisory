import type { Config } from 'drizzle-kit'

// Migrations run against DIRECT_URL (Supabase session pooler, port 5432).
// The transaction pooler on 6543 used at runtime cannot run DDL reliably.
export default {
  schema: './app/lib/db/schema.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DIRECT_URL || process.env.DATABASE_URL || '',
  },
  strict: true,
  verbose: true,
} satisfies Config
