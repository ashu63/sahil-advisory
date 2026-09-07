# Backend design: auth, database, payments and portals

What exists today, what a complete backend looks like, and the order to build
it in. Companion to `docs/PROJECT.md` (current state) and the blueprint.

---

## 0. What happens today

`POST /api/leads` (`app/api/leads/route.ts`) already does real work:

1. Rate-limits by IP, 5 submissions per 10 minutes.
2. Rejects anything that is not a valid 10-digit Indian mobile number.
3. Silently absorbs bot submissions via a honeypot field.
4. `console.log`s the lead.
5. Emails operations **only if `RESEND_API_KEY` is set**.

There is no database, no account, and no way for a client to see anything.

**The live gap:** `RESEND_API_KEY` is not set in production, so step 5 is
skipped and every lead exists only in Vercel's runtime logs. Nobody watches
those. Fix this before anything else; it needs no code.

---

## 1. Stack

Chosen in the blueprint and unchanged. Everything runs in `ap-south-1` /
`bom1` so client data stays in India.

| Concern | Choice | Notes |
|---|---|---|
| Database | Supabase Postgres + Drizzle | Free tier is always-on. Runtime uses the transaction pooler on `:6543` with `prepare:false`; migrations use the session pooler on `:5432` via `DIRECT_URL` |
| Auth | NextAuth 5 (Auth.js) | Google plus email magic link via Resend. JWT sessions. Phone captured after sign-up for WhatsApp |
| File storage | Supabase Storage, private bucket | Never public. Signed URLs valid 10 minutes |
| Payments | Razorpay Orders | Server creates the order, webhook confirms it |
| Email | Resend | Transactional only |
| WhatsApp | Meta Cloud API via a BSP (AiSensy or Interakt) | Utility templates, roughly ₹0.12 per message |
| PDFs | `@react-pdf/renderer` | Invoices and draft computations, generated server-side |

---

## 2. Data model

Full table list is in the blueprint. These are the ones that carry the product.

**`users`** — id, name, email (unique), phone, role (`client` / `expert` /
`admin`), whatsapp_opt_in, created_at. Role drives every access decision.

**`leads`** — what the callback form writes today, plus status
(`new` / `contacted` / `converted` / `lost`), owner_id and UTM fields. A lead
becomes an order when they pay; keep both so you can measure conversion.

**`services`** — the catalogue. Right now this is a TypeScript file
(`app/lib/services.ts`), which is correct for Phase 0 because it is fast,
versioned and needs no admin screen. Move it to the database only when
non-technical staff need to change prices without a deploy.

**`orders`** — user_id, status, subtotal, discount, GST, total, coupon,
financial years covered, assigned expert, due_at. The spine of the product.

**`order_items`** — one row per service in an order, with the price captured
at purchase time. Never recompute a historical price from the catalogue.

**`payments`** — provider order and payment ids, amount, signature_verified,
raw webhook payload. Unique index on the provider payment id for idempotency.

**`documents`** — order_id, doc_type, storage_path, mime, size, sha256,
status. Metadata only; the bytes live in Storage.

**`order_status_events`** — every transition, who made it, and whether the
client was notified. This is the audit trail and it drives the timeline the
client sees.

**`messages`** — per-order thread between client and assigned expert.

**`invoices`** — number (sequential per financial year, gapless), pdf_path,
place_of_supply. Required for GST compliance.

Enable row level security on `documents`, `orders`, `messages` and
`consultations`. Policy: the owning user, the assigned expert, or an admin.

---

## 3. Auth

NextAuth 5 with Google and email magic link. Sessions are JWTs, so the proxy
can check for a session cookie without touching the database.

`proxy.ts` already gates `/dashboard` and `/admin` on cookie presence. That is
deliberately only a redirect for logged-out visitors, not authorisation. Every
route handler and server component must independently check the role, because
a cookie proves a session exists, not what it may do.

Three roles:

- **client** sees only their own orders, documents and messages.
- **expert** sees orders assigned to them, and nothing else.
- **admin** sees everything. Seeded from an `ADMIN_EMAILS` allowlist.

Add TOTP for staff accounts before the first employee is hired.

---

## 4. The money path

The one flow that must never be wrong.

1. Client picks services. The cart lives client-side.
2. `POST /api/orders` recomputes every price **on the server** from the
   catalogue, applies the coupon, adds 18% GST and creates a Razorpay order.
   Never trust an amount sent by the browser.
3. Razorpay checkout opens with that order id.
4. `POST /api/webhooks/razorpay` verifies the HMAC signature, and only then
   marks the order paid. Treat the browser's success callback as a hint for
   the user interface, never as proof of payment.
5. Webhooks retry, so make the handler idempotent: unique constraint on the
   provider payment id, and ignore a payment already recorded.
6. On payment, generate the invoice with the next number in the financial
   year sequence and fire the `order_paid` notification.

Test the signature verification and the invoice numbering. Those two are worth
unit tests before anything else in the backend.

---

## 5. Documents

Clients upload PAN, Aadhaar and Form 16. This is sensitive personal data under
the DPDP Act and the handling must reflect that.

- Upload through a server route that checks MIME type and size (15 MB cap),
  renames the file and strips metadata. Do not let the browser write directly
  to storage with a long-lived token.
- Store at `orders/{orderId}/{docType}/{uuid}.pdf` in a private bucket.
- Serve through signed URLs valid for 10 minutes, generated per request after
  the role check.
- Record a SHA-256 per file so you can prove a document was not altered.
- Never log document bytes, PAN or Aadhaar. Mask PAN in the interface as
  `ABCDE****F`.
- Log every document view and download in the audit table.

---

## 6. Portals

**Client dashboard** (`/dashboard`) — order list, a document checklist showing
what is still missing, a status timeline, the draft computation to approve,
the message thread, and invoices.

**Expert portal** (`/expert`) — assigned orders only, document review with an
approve or reject reason, status transitions, and deliverable upload.

**Admin** (`/admin`) — orders on a kanban board by status with colour by
service-level agreement, one-click expert assignment, the leads inbox with a
callback timer, coupons, reviews moderation, and a GST invoice register export
for the firm's own GSTR-1.

Order status flow, with each transition writing an event and a notification:

```
paid → docs_pending → in_review → draft_ready → client_approval
     → filed → verified → closed
```

---

## 7. Notifications

WhatsApp utility templates plus email; the dashboard always reflects the
current state. Trigger on: paid, documents missing (with nudges at day 2 and
day 5), draft ready, filed, closed with a rating request, consultation booked
and its reminders, deadline reminders, and payment failed.

Start with click-to-chat links, which are free, and move to the Business API
once volume justifies the roughly ₹1,000 a month.

---

## 8. Build order

Each step is independently shippable. Do not start step 2 before step 1 earns
something.

**Step 0, today, no code.** Set `RESEND_API_KEY`, `LEADS_TO_EMAIL` and
`LEADS_FROM_EMAIL` in Vercel production. Leads reach an inbox. This is the
highest value change available and it takes minutes.

**Step 1, leads in a database.** Supabase project, Drizzle, the `leads` and
`users` tables, and the lead route writing a row. Add a minimal admin page
behind the email allowlist to work the inbox. You stop losing leads and you
can measure where they come from.

**Step 2, accounts.** NextAuth with Google and magic link, the `users` upsert,
role support, and a real `/dashboard` shell showing "no orders yet". Small on
its own, but everything else depends on it.

**Step 3, orders and payment.** Cart, server-side pricing, Razorpay order
creation, the verified webhook, invoice numbering and PDF. This is the step
that turns the site into a business rather than a brochure.

**Step 4, documents and status.** Private bucket, upload route, per-service
checklist, the status timeline, and the client approval step.

**Step 5, operations.** Admin kanban, expert assignment, the expert portal,
and the WhatsApp templates.

**Step 6, retention.** Deadline reminders by cron, the yearly return-client
nudge, referrals and reviews.

Steps 1 and 2 are a few days of work. Step 3 is the one that deserves real
care and real tests.

---

## 9. Non-negotiables

- Recompute prices on the server. Always.
- A payment is real only after the webhook signature verifies.
- Invoice numbers are sequential per financial year with no gaps.
- Role is checked in the route handler, not only in the proxy.
- Documents are private, signed briefly, and access is logged.
- PAN and Aadhaar never appear in logs or error messages.
- Nightly `pg_dump` to a private bucket. Supabase point-in-time recovery is a
  paid feature; do not assume you have it.
