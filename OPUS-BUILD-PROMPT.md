# BUILD PROMPT — "Freedom HQ" Veteran Membership App (Military to Financial Freedom)

Paste everything below this line into Opus as the build prompt.

---

You are building a production-ready membership web app for **Military to Financial Freedom** (militarytofinancialfreedom.com), owned by Drew Delicieux, a 100% P&T disabled Army veteran and author of the MTFF field manual. The app is the interactive, always-on version of his book: veterans log in, track their VA claim journey and benefits, and get AI-powered **education** on VA disability claims, C&P exams, VA home loans, GI Bill / VR&E, and building income after service.

## ⚖️ NON-NEGOTIABLE LEGAL GUARDRAILS (read first — these shape every feature)

Federal law (38 U.S.C. § 5901 et seq.) restricts who may *prepare, present, or prosecute* VA claims, and even VA-accredited reps may not charge for initial-claim assistance. The CFPB explicitly flags unaccredited "coaches/consultants" as a red flag, a federal court ruled Veterans Guardian acted as an unaccredited agent, Trajector faces a class action over $4,500–$20,000+ fees, and the GUARD VA Benefits Act would reinstate criminal penalties for anyone who "solicits, contracts for, charges, or receives" fees for claims preparation. Therefore this product is **self-service educational software** (the VA Ready / VA Claim Commander compliance model), never a claims-assistance service:

1. The app NEVER prepares, fills out, reviews, drafts, or files a specific veteran's claim, forms, or personal statements — not even the AI. No "upload your claim and we'll fix it."
2. The AI assistant gives **general educational information** about how the VA system works, cites official sources (VA.gov, 38 CFR), and for any individualized claims help it directs users to **free accredited VSOs** (with a link to VA's accreditation search: https://www.va.gov/ogc/apps/accreditation/index.asp).
3. All claims-related content (tracker, calculators, C&P education, checklists) must work identically on the FREE tier. **The paid tier must never gate anything that could be construed as paid claims assistance.** Paid tier monetizes: the financial-freedom roadmap, VA loan & house-hacking tools, GI Bill/VR&E planning, business-building content, community, and unlimited AI education chats on those topics.
4. Persistent disclaimers (footer + AI chat header + onboarding acceptance): "Military to Financial Freedom is an educational tool. We are not a VSO, law firm, or VA-accredited representative. We do not file, prepare, or prosecute claims, and we never charge for claims help — accredited VSOs will help you file for FREE. Nothing here is legal, medical, or financial advice. We never promise a rating or outcome."
5. Never promise ratings, percentages, or outcomes anywhere in UI copy or AI responses. The rating calculator shows VA math, not predictions.
6. The AI system prompt must hard-code these rules and refuse individualized claim-preparation requests with a warm redirect to free VSOs.

## Brand

- Tone: direct, no-hype, "proof over promises," field-manual aesthetic (Section 01, Rules of Engagement, briefing format). Tagline: "Leave the army with a plan — not just a DD-214."
- Dark military-inspired palette with bold typography, mobile-first. Match militarytofinancialfreedom.com.
- Differentiator vs. claims-only competitors (VA Ready, VA Claim Commander, ClaimRecon): this is the only app covering the veteran's **whole financial life** — claims education + VA loan wealth-building + education benefits + business income, run by a vet who documents his own numbers.

## Tech stack

- Next.js (App Router) deployed on **Netlify** (owner already uses Netlify; ALL secrets live in Netlify env vars only — never committed).
- **Supabase**: auth (email magic link + Google), Postgres, row-level security on all user data.
- **Stripe**: subscriptions (Checkout + customer portal + webhooks on a Netlify function).
- **Claude API** (model `claude-sonnet-5`) for the AI assistant, called server-side only; per-user daily message metering in Postgres.
- No PII beyond email + first name + optional branch/era of service. **Do NOT collect SSNs, VA file numbers, or medical documents in v1** (skip document upload/vault until a security review). Claim tracker stores only user-entered labels, dates, and status — no uploaded records.

## Tiers & pricing

- **Recruit (FREE, no credit card)**: everything claims-related + 5 AI messages/day.
- **Field Grade ($9.97/mo or $79/yr)**: unlimited AI, all financial-freedom tools, roadmap, community access. 
- **Founding Member ($149 one-time, first 100 only)**: lifetime Field Grade + founder badge. Countdown of remaining spots.
- Launch mode flag: `FREE_FOR_ALL=true` makes every account Field Grade during the free launch period; flipping it off starts enforcement with a grandfather flag for early signups (they keep free Field Grade for 90 days, then a friendly upgrade path).
- Benchmarks baked into this pricing: standard subscription anchor is $7.99–$9.99/mo; freemium converts ~2% and half of conversions happen day one — so onboarding must deliver an instant win (see First Session below).

## Features (build in this order)

### 1. Onboarding + instant win (the Day-0 hook)
90-second setup: branch, separation status (active/transitioning/out), current rating (or "not rated"), goals (rating ↑ / buy a house / school / business). Immediately produce a personalized **"Benefits Left on the Table" briefing**: estimated monthly compensation at their rating (2026 VA rate tables, single/married/kids), a checklist of federal benefits they likely qualify for but may not be using (VA loan entitlement, GI Bill, VR&E Chapter 31, property-tax exemptions pointer, SAH/SHA if applicable, CHAMPVA, commissary, etc.), and their next 3 recommended missions. This screen is shareable (image export) — it's the growth loop.

### 2. VA disability combined-rating calculator
Full VA math: combined ratings table, bilateral factor, dependents, SMC-K awareness (educational note only). Live dollar amounts from 2026 rate tables. Free forever, no login required for the basic calc (login to save) — this is also the SEO landing tool.

### 3. Claim journey tracker (self-service)
User manually logs their own claim(s): condition label, date filed, current VA step (the 8 VA.gov claim steps), C&P exam dates, decision letters received, ITF date. Timeline view + educational context per step ("what usually happens in this phase, average wait times, what YOU can do"). Email reminders for user-entered dates (C&P exam, deadline to respond, 1-year ITF expiry). Never connects to VA.gov accounts in v1.

### 4. AI Battle Buddy (educational chat)
Claude-powered chat with the compliance system prompt from the guardrails above. Personas/modes: Claims Education, C&P Exam Prep (general — what examiners assess per 38 CFR, how to describe symptoms honestly and completely, never coaching to exaggerate), VA Loan & House Hacking, GI Bill vs VR&E, Business Launch (drawing on the MTFF book's 5 income pillars — owner will supply book text as knowledge). Every claims answer footer: "For help filing, an accredited VSO will represent you for free → [VSO finder link]". Free: 5 msgs/day. Paid: unlimited.

### 5. Financial Freedom Command Center (the paid core)
- **VA loan mission planner**: entitlement explainer, payment calculator, house-hack analyzer (duplex/triplex/quad: BAH-era math, rent covers mortgage scenarios), funding-fee exemption callout for disabled vets.
- **Education benefits war-gamer**: GI Bill vs VR&E side-by-side (tuition, BAH/MHA, who qualifies), transfer-to-dependents explainer.
- **24-month roadmap**: the book's roadmap as interactive missions with progress tracking, organized by the 5 income pillars; checking off missions builds a visible "Freedom Score."
- **Income pillar trackers**: simple monthly logging of benefit income, rental income, business income → one dashboard chart showing the gap to their "freedom number."

### 6. Accounts, billing, community hooks
Stripe checkout/portal, email via Resend (transactional + reminder emails), link out to the existing Skool community for members, /roadmap public page for feature votes.

## Build requirements

- Ship as a monorepo-free single Next.js app, TypeScript, Tailwind. Seed the DB with 2026 VA compensation rate tables and the combined-ratings table as versioned JSON (easy annual update).
- Mobile-first; most veterans will use phones.
- Accessibility: WCAG AA, large tap targets, dyslexia-friendly font toggle — disabled veterans are the audience, take 508-style access seriously.
- Analytics: privacy-light (Plausible or simple Postgres events): signup, day-0 briefing completed, calc used, AI msg sent, upgrade clicked.
- Include seed content: educational copy for each claim step, C&P prep guide, VA loan guide — written in the MTFF field-manual voice, each ending with an official VA.gov source link.
- Write the AI system prompt as a versioned file (`/ai/system-prompt.ts`) implementing every guardrail above; include unit tests that assert refusal behavior for "write my personal statement," "fill out my 21-526EZ," "what should I tell the C&P examiner to get 70%."
- Env vars documented in `.env.example` (values live only in Netlify): SUPABASE_URL, SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE, STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET, ANTHROPIC_API_KEY, RESEND_API_KEY, FREE_FOR_ALL.

Start by scaffolding the app, then build features 1→6 in order, committing after each. Ask before adding any feature that touches claims beyond education/tracking.
