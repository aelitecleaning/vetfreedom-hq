"use client";

import { useState } from "react";
import { TIERS } from "@/lib/tiers";
import { track } from "@/lib/analytics";

type Plan = "monthly" | "annual" | "founding";

export function PricingTable() {
  const [busy, setBusy] = useState<Plan | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function checkout(plan: Plan) {
    setError(null);
    setBusy(plan);
    void track("upgrade_clicked", { plan });
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ plan }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        setError(data.error ?? "Checkout isn't available yet. Try again soon.");
      }
    } catch {
      setError("Network error. Try again.");
    } finally {
      setBusy(null);
    }
  }

  return (
    <div className="space-y-5">
      <div className="grid gap-4 md:grid-cols-3">
        {/* Recruit */}
        <div className="brief-card flex flex-col">
          <p className="field-label">{TIERS.recruit.name}</p>
          <p className="mt-1 text-3xl font-bold">Free</p>
          <p className="text-xs text-olive-400">{TIERS.recruit.priceNote}</p>
          <ul className="mt-4 flex-1 space-y-2 text-sm text-olive-400">
            {TIERS.recruit.features.map((f) => (
              <li key={f}>✓ {f}</li>
            ))}
          </ul>
          <a href="/onboarding" className="btn-ghost mt-4">
            Start free
          </a>
        </div>

        {/* Field Grade */}
        <div className="brief-card flex flex-col border-signal-500">
          <div className="flex items-center justify-between">
            <p className="field-label text-signal-400">{TIERS.fieldGrade.name}</p>
            <span className="rounded bg-signal-500 px-2 py-0.5 text-xs font-bold text-base-950">
              Most value
            </span>
          </div>
          <p className="mt-1 text-3xl font-bold">$9.97<span className="text-base font-normal text-olive-400">/mo</span></p>
          <p className="text-xs text-olive-400">or $79/year (2 months free)</p>
          <ul className="mt-4 flex-1 space-y-2 text-sm text-olive-400">
            {TIERS.fieldGrade.features.map((f) => (
              <li key={f}>✓ {f}</li>
            ))}
          </ul>
          <div className="mt-4 grid gap-2">
            <button className="btn-primary" disabled={busy !== null} onClick={() => checkout("monthly")}>
              {busy === "monthly" ? "Loading…" : "Go monthly — $9.97"}
            </button>
            <button className="btn-ghost" disabled={busy !== null} onClick={() => checkout("annual")}>
              {busy === "annual" ? "Loading…" : "Go annual — $79"}
            </button>
          </div>
        </div>

        {/* Founding */}
        <div className="brief-card flex flex-col">
          <p className="field-label">{TIERS.founding.name}</p>
          <p className="mt-1 text-3xl font-bold">$149<span className="text-base font-normal text-olive-400"> once</span></p>
          <p className="text-xs text-olive-400">{TIERS.founding.priceNote}</p>
          <ul className="mt-4 flex-1 space-y-2 text-sm text-olive-400">
            {TIERS.founding.features.map((f) => (
              <li key={f}>✓ {f}</li>
            ))}
          </ul>
          <button className="btn-ghost mt-4" disabled={busy !== null} onClick={() => checkout("founding")}>
            {busy === "founding" ? "Loading…" : "Become a founder"}
          </button>
        </div>
      </div>

      {error && <p className="text-sm text-signal-400">{error}</p>}

      <div className="brief-card text-sm text-olive-400">
        <p className="font-semibold text-sand">Why nothing claims-related costs money</p>
        <p className="mt-1">
          By law, helping a veteran prepare or file a VA claim is reserved for
          VA-accredited representatives — and they do it for free. So our
          calculator, claim tracker, and C&P education are free for everyone,
          forever. Membership only unlocks the wealth-building side: VA-loan tools,
          school-benefit planning, the roadmap, income trackers, community, and
          unlimited AI on those topics.
        </p>
      </div>
    </div>
  );
}
