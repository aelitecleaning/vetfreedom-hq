import Link from "next/link";
import type { Metadata } from "next";
import { TIERS } from "@/lib/tiers";

export const metadata: Metadata = {
  title: "Military to Financial Freedom — the interactive field manual for veterans",
  description:
    "Track your VA claim, learn how your benefits actually work, and build income after service. Free to start. Built by a 100% P&T disabled vet. Educational tool — not a VSO or law firm.",
};

export default function HomePage() {
  return (
    <div className="space-y-16">
      {/* Hero */}
      <section className="space-y-6 pt-6">
        <p className="field-label">Section 00 · Freedom HQ</p>
        <h1 className="max-w-3xl text-4xl font-bold leading-tight sm:text-5xl">
          Leave the service with a plan —{" "}
          <span className="text-signal-400">not just a DD-214.</span>
        </h1>
        <p className="max-w-2xl text-lg text-olive-400">
          The interactive field manual for veterans. Track your VA claim, learn how
          your benefits really work, and build income after the uniform — claims
          education, VA-loan wealth, school benefits, and business, in one place.
          Built by a 100% P&amp;T disabled vet who shows his own numbers.
        </p>
        <div className="flex flex-wrap gap-3">
          <Link href="/onboarding" className="btn-primary">
            Start free — 90-second briefing
          </Link>
          <Link href="/calculator" className="btn-ghost">
            Try the rating calculator
          </Link>
        </div>
        <p className="text-sm text-olive-400">
          Free forever for everything claims-related. No credit card. Accredited
          VSOs help you file for free — we&apos;ll always tell you so.
        </p>
      </section>

      {/* Proof-over-promises trust bar */}
      <section className="grid gap-4 sm:grid-cols-3">
        {[
          ["We never touch your claim", "We teach how the system works and point you to free accredited VSOs to file. We never prepare, file, or charge for claims."],
          ["Built by a vet, priced for vets", "No $5,000 coaching fees, no cut of your back pay. A low monthly membership — or free while we launch."],
          ["Proof, not hype", "The playbook comes from real income streams the founder documents — VA loans, rentals, and a home-service business."],
        ].map(([h, p]) => (
          <div key={h} className="brief-card">
            <p className="font-semibold text-sand">{h}</p>
            <p className="mt-1 text-sm text-olive-400">{p}</p>
          </div>
        ))}
      </section>

      {/* What you get */}
      <section className="space-y-5">
        <h2 className="text-2xl font-bold">Your five tools</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {[
            ["Benefits briefing", "A 90-second intake shows your estimated comp and the benefits you may be leaving on the table.", "/onboarding"],
            ["Rating calculator", "See the VA's real combined-ratings math, bilateral factor, and 2026 pay estimates.", "/calculator"],
            ["Claim tracker", "Log your claim and see exactly where it sits across the VA's 8 stages, with reminders.", "/tracker"],
            ["Battle Buddy AI", "Plain-English answers on claims, C&P exams, VA loans, and school benefits, 24/7.", "/chat"],
            ["Command Center", "VA-loan house-hack planner, GI Bill vs VR&E war-gamer, the 24-month roadmap, and income trackers.", "/command-center"],
            ["The community", "Founding members get into the private community to execute the playbook together.", "/pricing"],
          ].map(([h, p, href]) => (
            <Link key={h} href={href} className="brief-card block hover:border-signal-500">
              <p className="font-semibold text-sand">{h}</p>
              <p className="mt-1 text-sm text-olive-400">{p}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Pricing preview */}
      <section className="space-y-5">
        <h2 className="text-2xl font-bold">Start free. Upgrade when it pays off.</h2>
        <div className="grid gap-4 md:grid-cols-3">
          <PlanCard t={TIERS.recruit} />
          <PlanCard t={TIERS.fieldGrade} highlight />
          <PlanCard t={TIERS.founding} />
        </div>
        <Link href="/pricing" className="inline-block text-signal-400 underline">
          See full membership details →
        </Link>
      </section>
    </div>
  );
}

function PlanCard({
  t,
  highlight,
}: {
  t: { name: string; price: string; priceNote: string; blurb: string };
  highlight?: boolean;
}) {
  return (
    <div className={`brief-card ${highlight ? "border-signal-500" : ""}`}>
      <p className="field-label">{t.name}</p>
      <p className="mt-1 text-2xl font-bold">{t.price}</p>
      <p className="text-xs text-olive-400">{t.priceNote}</p>
      <p className="mt-2 text-sm text-olive-400">{t.blurb}</p>
    </div>
  );
}
