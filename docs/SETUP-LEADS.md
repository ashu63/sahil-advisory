# Setting up lead capture: Supabase and WhatsApp

The code is deployed. It needs environment variables to switch on. Nothing
here requires a code change.

Behaviour is layered, so partial setup still helps:

| Configured | What happens to a lead |
|---|---|
| Nothing | Written to the Vercel log only. This is the state today |
| Resend | Log plus an email to operations |
| Supabase | Stored in the `leads` table, kept permanently |
| WhatsApp | An instant alert on your phone |

A lead is never lost because a later layer fails. If the database is
unreachable the visitor still sees success, the lead is still logged, and the
WhatsApp alert still fires. Verified against a real Postgres and against a
deliberately broken connection.

---

## 1. Supabase

1. Create a project at supabase.com in the **ap-south-1 (Mumbai)** region so
   client data stays in India.
2. Project settings, then Database, then Connection string, and copy the URI.
   You need two forms of it:

   ```
   DATABASE_URL   port 6543   (Transaction pooler)   used at runtime
   DIRECT_URL     port 5432   (Session pooler)       used by migrations
   ```

   Replace `[YOUR-PASSWORD]` in both with the database password.

3. Create the table. Either run the migration locally:

   ```bash
   DIRECT_URL="postgresql://...:5432/postgres" pnpm db:migrate
   ```

   or paste `drizzle/0000_create_leads.sql` into the Supabase SQL editor and
   run it.

4. Add `DATABASE_URL` and `DIRECT_URL` to the Vercel project's environment
   variables (Production, and Preview if you want previews writing too), then
   redeploy.

Row level security is enabled on the table with no policies, so Supabase's
public API returns nothing for it. The app connects as the table owner over
`DATABASE_URL` and is unaffected. Do not add a policy unless you know exactly
who it opens the table to; the table holds names and phone numbers.

---

## 2. WhatsApp

Set `WHATSAPP_NOTIFY_TO` to the number that should receive alerts, digits
only with country code: `917888412302`.

Then pick one of two providers.

### Option A: official WhatsApp Cloud API (`WHATSAPP_PROVIDER=meta`)

The proper long-term path, and what the client-facing messages in later phases
will use. Requires a Meta business account and an approved template.

1. Create an app at developers.facebook.com and add the WhatsApp product.
2. Note the **Phone number ID** and generate a permanent access token.
3. Create a message template named `new_lead` with a body containing four
   placeholders in this order:

   ```
   New lead: {{1}}
   Phone: {{2}}
   Service: {{3}}
   Detail: {{4}}
   ```

   Category "Utility". Approval usually takes a few hours.
4. Set:

   ```
   WHATSAPP_PROVIDER=meta
   WHATSAPP_TOKEN=...
   WHATSAPP_PHONE_NUMBER_ID=...
   WHATSAPP_TEMPLATE_NAME=new_lead
   WHATSAPP_TEMPLATE_LANG=en
   ```

Business-initiated WhatsApp messages must use an approved template. That is
Meta's rule, not a limitation of this code, which is why the template exists.

### Option B: webhook (`WHATSAPP_PROVIDER=webhook`)

Works in minutes and is the right choice if you want alerts today. Point it at
a BSP such as AiSensy or Interakt, or at an automation in Zapier, Make or n8n
that forwards to WhatsApp.

```
WHATSAPP_PROVIDER=webhook
WHATSAPP_WEBHOOK_URL=https://...
WHATSAPP_WEBHOOK_TOKEN=          # optional, sent as a bearer token
```

The endpoint receives:

```json
{
  "to": "917888412302",
  "text": "New lead on the website\nName: ...\nPhone: +91...\nReply: https://wa.me/91...",
  "params": ["Ramesh Kumar", "+919876543210", "ITR Filing", "Capital gains"]
}
```

Use `text` for a ready-made message, or `params` to build your own.

A note on privacy: whatever service you point this at receives the lead's name
and phone number. Choose one you are willing to name as a processor in the
privacy policy. That is a reason to prefer a real BSP over a personal
automation once you are past testing.

---

## 3. Email

Set these so leads also arrive in an inbox. This is the fastest win of the
three and takes minutes.

```
RESEND_API_KEY=...
LEADS_TO_EMAIL=sahiladvisory1@gmail.com
LEADS_FROM_EMAIL=leads@yourdomain
```

The sending domain must be verified in Resend before delivery works.

---

## 4. Checking it works

Submit the callback form on the live site, then:

- **Database:** Supabase, Table editor, `leads`. The row should be there with
  `status = new`, and `notified_count = 1` once an alert went out.
- **WhatsApp:** the message arrives on `WHATSAPP_NOTIFY_TO`.
- **Logs:** Vercel, Logs, filter for `[lead]`. A line starting
  `[lead] whatsapp not sent:` or `[lead] email not sent:` tells you exactly
  which variable is missing or which provider rejected the call.

---

## What is captured

Name, phone, the answer to the page's question, the optional message, the
service and page it came from, the referrer, any `utm_*` / `gclid` /
`fbclid` parameters, the IP and the user agent.

No PAN, Aadhaar or document is collected by this form, and none of those ever
appear in a log line.

---

## Not built yet

There is no admin screen to work the leads inbox. That needs sign-in, which is
step 2 of `docs/BACKEND.md`. Until then, read leads in the Supabase table
editor and work from the WhatsApp and email alerts.
