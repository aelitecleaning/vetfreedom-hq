# Military to Financial Freedom — Freedom HQ

The interactive field manual for veterans. A membership web app where veterans
track their VA claim, learn how their benefits work, and build income after
service — claims **education**, VA-loan wealth-building, school benefits, and
business, in one place.

Built by Drew Delicieux (100% P&T disabled Army veteran), author of the MTFF
field manual at [militarytofinancialfreedom.com](https://militarytofinancialfreedom.com).

---

## ⚖️ Compliance is the architecture (read this first)

Federal law (38 U.S.C. § 5901 et seq.) reserves the *preparation, presentation,
and prosecution* of VA claims to **VA-accredited** representatives — and even
they may not charge for initial-claim help. The CFPB has flagged unaccredited
"coaches/consultants" as a red flag; courts and a class action have gone after
"claim shark" firms. So this product is **self-service educational software**,
never claims assistance. That is not a disclaimer bolted on top — it shapes every
feature:

- **Nothing claims-related is ever behind a paywall.** The calculator, claim
  tracker, C&P education, and claims-mode AI answers are free for everyone,
  forever. Paid tiers only unlock the *financial-freedom* tools. See
  [`src/lib/tiers.ts`](src/lib/tiers.ts).
- **The AI never prepares, drafts, fills, reviews, or files a claim** and never
  predicts an outcome. It teaches in general terms and routes individualized help
  to **free accredited VSOs**. The rules are hard-coded in
  [`src/ai/system-prompt.ts`](src/ai/system-prompt.ts) and enforced by a
  deterministic pre-screen in [`src/ai/guard.ts`](src/ai/guard.ts).
- **No sensitive PII.** No SSNs, VA file numbers, or medical uploads in v1. The
  claim tracker stores only what the user types, client-side.
- A persistent disclaimer ([`src/components/Disclaimer.tsx`](src/components/Disclaimer.tsx))
  appears in the footer, the AI header, and onboarding.

If you extend this app, keep the guardrail tests green:
`npm test` runs [`src/ai/system-prompt.test.ts`](src/ai/system-prompt.test.ts).

---

## Stack

- **Next.js 14** (App Router, TypeScript, Tailwind) — deploy on **Netlify**
- **Supabase** — auth (magic link + Google), Postgres, row-level security
- **Stripe** — subscriptions + one-time founding tier
- **Claude API** (`claude-sonnet-5`) — the Battle Buddy AI, server-side only
- **Resend** — transactional + reminder email (wire-up point ready)

## Getting started

```bash
npm install
cp .env.example .env.local   # fill in for full functionality
npm run dev                  # http://localhost:3000
npm test                     # runs the VA-math + compliance guardrail tests
```

The app boots and the **free tools work with zero configuration** — the
calculator, tracker, onboarding/briefing, and roadmap run client-side. Supabase,
Stripe, and the AI degrade gracefully until their keys are set.

### Configuration

All secrets live in **Netlify → Site settings → Environment variables** (never
committed). See [`.env.example`](.env.example) for the full list. Key flags:

- `FREE_FOR_ALL=true` — free launch mode: every account gets full Field Grade
  access. Flip to `false` to start enforcing paid tiers. Early adopters are
  auto-grandfathered 90 days (see the signup trigger in
  [`supabase/schema.sql`](supabase/schema.sql)).
- `ANTHROPIC_API_KEY` — switches on Battle Buddy.
- `MTFF_BOOK_KNOWLEDGE` — (optional) paste the book text here to give the AI
  reference knowledge for business/finance answers.

### Database

Run [`supabase/schema.sql`](supabase/schema.sql) in the Supabase SQL editor. It
creates `profiles`, `ai_usage` (daily free-tier metering), `analytics_events`,
and `feature_votes`, all with RLS, plus the new-user trigger and the
`increment_ai_usage` RPC.

### Stripe

Create three prices (monthly, annual, one-time founding) and set their IDs in the
env. Point a webhook at `/api/stripe/webhook` for
`checkout.session.completed` and `customer.subscription.deleted`.

## Project map

| Path | What |
|------|------|
| `src/lib/va/` | VA combined-ratings math + 2026 rate tables (versioned JSON) |
| `src/ai/` | System prompt + deterministic compliance guard + tests |
| `src/data/` | Claim steps, benefits catalog, 24-month roadmap |
| `src/lib/` | Briefing builder, tiers/entitlement, finance math, Supabase/Stripe |
| `src/app/` | Pages (landing, calculator, onboarding, tracker, chat, command-center, pricing) + API routes |
| `src/components/` | UI (calculator, tracker, Battle Buddy, briefing, command-center tools) |

## Annual maintenance

VA compensation rates change every December. Update
[`src/lib/va/rates-2026.json`](src/lib/va/rates-2026.json) with the new figures
and bump its `version`. **The seeded values are estimates — reconcile them
against the official VA rate tables before relying on them.**

---

*Not affiliated with, endorsed by, or connected to the U.S. Department of
Veterans Affairs or any government agency. Educational tool only — not legal,
medical, or financial advice.*
