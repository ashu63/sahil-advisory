# Sahil Advisory

Tax and compliance services platform: fixed-price ITR, GST, TDS, business registrations and notice replies, with free calculators, guides and a live compliance calendar.

Next.js 16 App Router, React 19, Tailwind CSS 4, TypeScript, pnpm, deployed on Vercel (`bom1`).

## Run it

```bash
pnpm install
cp .env.example .env.local   # fill in what you need; nothing is required for local browsing
pnpm dev
```

`pnpm build` to build, `pnpm lint` to lint, `pnpm exec tsc --noEmit -p tsconfig.json` to type-check.

## Where things live

| What | Where |
|---|---|
| Brand, contact, GSTIN, FY constants | `app/lib/site.ts` |
| Tax rates, slabs, due dates, thresholds | `app/lib/tax/rules/fy2025-26.ts` |
| Tax computation | `app/lib/tax/compute.ts` |
| Service catalogue and prices | `app/lib/services.ts` |
| Compliance deadlines | `app/lib/due-dates.ts` |
| Calculator registry and copy | `app/lib/calculators.ts` |
| Calculator UIs | `app/components/calculators/` |
| Guides | `app/lib/guides/content/` |
| Experts panel | `app/lib/experts.ts` |
| SEO helpers | `app/lib/seo.ts` |

Adding an entry to a registry automatically creates its route, sitemap entry, hub card and IndexNow submission.

## Read before contributing

`AGENTS.md` for conventions, `docs/PROJECT.md` for current state and open decisions, `TAX-PLATFORM-BLUEPRINT.md` for the full brief.
