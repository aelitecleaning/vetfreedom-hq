"use client";

import { useState } from "react";
import { OFFER, PLAYBOOK_PRICE } from "@/lib/tiers";
import { track } from "@/lib/analytics";

export function PricingTable() {
  const [buying, setBuying] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function buy() {
    setError(null);
    setBuying(true);
    void track("upgrade_clicked", { plan: "playbook" });
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ plan: "playbook" }),
      });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
      else setError(data.error ?? "Checkout isn't switched on yet. Check back soon.");
    } catch {
      setError("Network error. Try again.");
    } finally {
      setBuying(false);
    }
  }

  return (
    <div className="space-y-5">
      <div className="grid gap-4 md:grid-cols-2">
        {/* Free */}
        <div className="brief-card flex flex-col">
          <p className="field-label">{OFFER.free.name}</p>
          <p className="mt-1 text-3xl font-bold">Free</p>
          <p className="text-xs text-olive-400">{OFFER.free.priceNote}</p>
          <ul className="mt-4 flex-1 space-y-2 text-sm text-olive-400">
            {OFFER.free.features.map((f) => (
              <li key={f}>✓ {f}</li>
            ))}
          </ul>
          <a href="/onboarding" className="btn-ghost mt-4">
            Start free
          </a>
        </div>

        {/* Playbook (one-time) */}
        <div className="brief-card flex flex-col border-signal-500">
          <div className="flex items-center justify-between">
            <p className="field-label text-signal-400">{OFFER.playbook.name}</p>
            <span className="rounded bg-signal-500 px-2 py-0.5 text-xs font-bold text-sand">
              One-time
            </span>
          </div>
          <p className="mt-1 text-3xl font-bold">
            {PLAYBOOK_PRICE}
            <span className="text-base font-normal text-olive-400"> once</span>
          </p>
          <p className="text-xs text-olive-400">{OFFER.playbook.priceNote}</p>
          <ul className="mt-4 flex-1 space-y-2 text-sm text-olive-400">
            {OFFER.playbook.features.map((f) => (
              <li key={f}>✓ {f}</li>
            ))}
          </ul>
          <button className="btn-primary mt-4" onClick={buy} disabled={buying}>
            {buying ? "Loading…" : `Unlock the Playbook — ${PLAYBOOK_PRICE}`}
          </button>
          {error && <p className="mt-2 text-sm text-signal-400">{error}</p>}
        </div>
      </div>

      <div className="brief-card text-sm text-olive-400">
        <p className="font-semibold text-sand">No subscriptions, and nothing for claims</p>
        <p className="mt-1">
          Every tool is free — the calculator, tracker, C&P education, planners,
          roadmap, and daily AI. The one-time Playbook only adds the
          financial-freedom Vault (worksheets, scripts, guides), unlimited AI, and
          the community. By law, help preparing or filing a VA claim is free
          through accredited VSOs, so we never charge a cent for anything
          claims-related.
        </p>
      </div>
    </div>
  );
}
