import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Product roadmap",
  description: "What we're building next for Military to Financial Freedom, and what members are asking for.",
};

// Public roadmap. Feature voting writes to the feature_votes table (see
// schema.sql). Kept simple/static for launch; wire votes to Supabase when ready.
const SHIPPED = [
  "Benefits briefing (Day-0 instant win)",
  "VA combined-rating calculator",
  "Claim journey tracker",
  "Battle Buddy AI (educational)",
  "VA-loan house-hack planner",
  "GI Bill vs VR&E war-gamer",
  "24-month roadmap + Freedom Score",
];

const NEXT = [
  ["State-by-state benefits lookup", "Property-tax, tuition, and license benefits filtered to your state."],
  ["Reminder emails", "C&P exam, deadline, and ITF-expiry nudges to your inbox."],
  ["C&P exam education library", "Plain-English guides to what examiners assess, by body system."],
  ["Secure document vault", "After a security review — organize your own records (opt-in, encrypted)."],
  ["Mobile app", "The whole toolkit on iOS/Android."],
];

export default function RoadmapPage() {
  return (
    <div className="space-y-8">
      <div>
        <p className="field-label">Roadmap</p>
        <h1 className="mt-1 text-3xl font-bold">What we&apos;re building</h1>
        <p className="mt-2 max-w-2xl text-olive-400">
          Members steer this. Founding members get a direct line into what ships
          next.
        </p>
      </div>

      <section className="space-y-3">
        <h2 className="text-xl font-bold">Shipped</h2>
        <ul className="grid gap-2 sm:grid-cols-2">
          {SHIPPED.map((s) => (
            <li key={s} className="brief-card text-sm">
              ✓ {s}
            </li>
          ))}
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-bold">Up next</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {NEXT.map(([h, p]) => (
            <div key={h} className="brief-card">
              <p className="font-semibold text-sand">{h}</p>
              <p className="mt-1 text-sm text-olive-400">{p}</p>
            </div>
          ))}
        </div>
        <Link href="/pricing" className="inline-block text-signal-400 underline">
          Become a founding member to vote on priorities →
        </Link>
      </section>
    </div>
  );
}
