# Architecture and running cost

How the pieces fit, what each one costs, and where it grows.

## The shape

```
Visitor
  │
  ▼
Vercel (Next.js 16, Mumbai region)
  ├── 240 static pages: services, guides, calculators, due dates
  ├── /api/leads ──► Supabase Postgres (leads, activities, notifications)
  │                 └─ after response ──► Resend (email) + WhatsApp (Meta or webhook)
  ├── /login, /api/auth ──► Auth.js magic link (token in Postgres, session as JWT cookie)
  ├── /admin ──► reads Postgres, role checked per request
  └── /ingest ──► PostHog (proxied so it is first-party)

Browser
  └── track() ──► PostHog + GA4 + Clarity
```

Three rules keep it cheap and hard to break:

1. **Static by default.** Every public page is prerendered. A traffic spike
   costs bandwidth, not compute.
2. **Persist first, notify after.** The lead is written, the visitor gets a
   response, then alerts go out. A slow or broken provider never delays or
   loses a lead.
3. **No vendor in the request path that can be avoided.** Sessions are JWT
   cookies, so `/admin` still loads if the database is slow. Analytics is
   client-side and best-effort.

## Cost at today's scale

Everything below is free until the site is well past a few hundred leads a
month. Numbers are the free-tier limits as of September 2026; check them
before relying on them a year from now.

| Piece | Provider | Free tier | When it stops being free |
|---|---|---|---|
| Hosting | Vercel Hobby | 100 GB bandwidth, 1M function invocations | Commercial use on Hobby is against Vercel's terms, so budget for Pro at $20/month when revenue starts |
| Database | Supabase | 500 MB, 2 projects, pauses after 7 idle days | 500 MB is roughly a million leads. Pro is $25/month and removes the idle pause |
| Email | Resend | 3,000 emails/month, 100/day | Above that, $20/month for 50,000 |
| WhatsApp | Meta Cloud API | Charged per utility message, roughly ₹0.12 each | 1,000 leads/month is about ₹120. A BSP adds ₹1,000 to ₹1,500/month |
| Sign-in | Auth.js | Free, self-hosted | Never |
| Product analytics | PostHog | 1M events/month, 5,000 session recordings | Well beyond this site's traffic for a long time |
| Web analytics | GA4 | Free | Never at this scale |
| Session replay | Clarity | Free, unlimited | Never |
| Search | IndexNow, Search Console | Free | Never |

Realistic monthly cost for the first year: **₹0 to ₹2,000**, and most of that
is the Vercel Pro plan once you are trading.

The one thing worth paying for early is **Supabase's daily backups**, which
need Pro. Until then, run a nightly `pg_dump` into a private bucket, or accept
that the database is the only copy.

## Where it grows

Each of these is an addition, not a rewrite.

| Need | Change |
|---|---|
| Client accounts and a dashboard | Already supported by the auth tables. Add `/dashboard` pages reading orders by `session.user.id` |
| Orders and payment | Add `orders`, `order_items`, `payments` tables and a Razorpay webhook. Design in `docs/BACKEND.md` |
| Document upload | Supabase Storage private bucket. Same project, no new vendor |
| WhatsApp to clients | Same Meta template pipeline as the alerts, new templates |
| More staff | Add emails to `ADMIN_EMAILS`. An `expert` role already exists in the schema for the assigned-expert portal |
| Prices editable without a deploy | Move `app/lib/services.ts` into a `services` table. The registry shape is already the table shape |
| Rate limiting across regions | The in-memory limiter is per function instance. Swap `app/lib/rate-limit.ts` for Upstash Redis (free tier 10,000 commands/day) when the site runs on more than one instance |
| Heavy traffic | Nothing. Static pages scale on the CDN. Only `/api/leads` and `/admin` are compute |

## What is deliberately not here

- **No CMS.** Content is typed TypeScript, versioned in git. A CMS adds a
  vendor, a bill and a second source of truth. Revisit only if non-technical
  editors join.
- **No ORM-managed sessions.** JWT sessions avoid a database read on every
  admin page load and survive database outages.
- **No queue.** `after()` covers the current fan-out. A queue becomes worth it
  when a single lead triggers more than a few outbound calls, or when retries
  must be durable across deploys.
- **No client-side Supabase.** The browser never holds a Supabase key. All
  reads and writes go through server code, which is why row level security
  can stay policy-free.
