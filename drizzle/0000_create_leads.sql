CREATE TABLE "leads" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"phone" text NOT NULL,
	"email" text,
	"detail" text,
	"message" text,
	"service" text,
	"source_url" text,
	"referrer" text,
	"utm" jsonb,
	"status" text DEFAULT 'new' NOT NULL,
	"notes" text,
	"notified_count" integer DEFAULT 0 NOT NULL,
	"ip" text,
	"user_agent" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE INDEX "leads_created_at_idx" ON "leads" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "leads_status_idx" ON "leads" USING btree ("status");--> statement-breakpoint
CREATE INDEX "leads_phone_idx" ON "leads" USING btree ("phone");--> statement-breakpoint
-- Supabase exposes every table in the public schema through PostgREST using
-- the anon key. Leads hold names and phone numbers, so enable RLS and define
-- no policies: anon and authenticated roles then see zero rows through the
-- API. The app does not use supabase-js; it connects as the table owner over
-- DATABASE_URL, which bypasses RLS, so server-side reads and writes still work.
ALTER TABLE "leads" ENABLE ROW LEVEL SECURITY;
