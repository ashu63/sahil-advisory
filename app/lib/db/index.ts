import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import * as schema from './schema'

export * from './schema'

// Runtime connects through Supabase's transaction pooler (port 6543).
// `prepare: false` is required there: the pooler hands each query to whichever
// backend is free, so prepared statements from an earlier connection are not
// found. Migrations use DIRECT_URL (session pooler, 5432) instead.
//
// Serverless invocations are short-lived, so keep the pool tiny and let idle
// connections close quickly rather than exhausting Postgres.
declare global {
  var __sahilDb: ReturnType<typeof createClient> | undefined
}

function createClient() {
  const url = process.env.DATABASE_URL
  if (!url) return null
  const client = postgres(url, {
    prepare: false,
    max: 1,
    idle_timeout: 20,
    connect_timeout: 10,
  })
  return drizzle(client, { schema })
}

// Reused across hot reloads in development so a file change does not open a
// new pool every time.
export const db = globalThis.__sahilDb ?? createClient()
if (process.env.NODE_ENV !== 'production') globalThis.__sahilDb = db ?? undefined

export const isDbConfigured = Boolean(process.env.DATABASE_URL)
