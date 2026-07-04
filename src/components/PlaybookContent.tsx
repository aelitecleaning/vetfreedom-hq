"use client";

import { useState } from "react";
import { VAULT, type VaultItem } from "@/data/vault";
import { PLAYBOOK_PRICE } from "@/lib/tiers";
import { track } from "@/lib/analytics";

// The premium content area. If `unlocked`, shows the full Vault of financial
// worksheets. Otherwise shows a preview + one-time buy CTA. No claims content.
export function PlaybookContent({ unlocked }: { unlocked: boolean }) {
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

  if (!unlocked) {
    return (
      <div className="space-y-6">
        <div className="brief-card border-signal-500 text-center">
          <p className="field-label text-signal-400">The Playbook — {PLAYBOOK_PRICE} once</p>
          <p className="mx-auto mt-2 max-w-xl text-olive-400">
            The tools are free. The Playbook is the fill-in Vault behind them:
            deal analyzers, lender and rental scripts, the freedom-number
            worksheet, and the home-service business launch kit — plus unlimited
            AI and the private community. Pay once, keep it for life.
          </p>
          <button className="btn-primary mx-auto mt-4 w-fit" onClick={buy} disabled={buying}>
            {buying ? "Loading…" : `Unlock the Playbook — ${PLAYBOOK_PRICE}`}
          </button>
          {error && <p className="mt-2 text-sm text-signal-400">{error}</p>}
        </div>

        <p className="field-label">What&apos;s inside</p>
        <div className="grid gap-3 sm:grid-cols-2">
          {VAULT.map((item) => (
            <div key={item.slug} className="brief-card">
              <p className="font-semibold text-sand">{item.title}</p>
              <p className="mt-1 text-sm text-olive-400">{item.summary}</p>
              <p className="mt-2 font-stencil text-[10px] uppercase tracking-widest text-base-600">
                Locked · {item.lines.length} items
              </p>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="rounded-md border border-olive-600 bg-base-900 p-3 text-sm text-olive-400">
        ✓ Playbook unlocked. Copy or print any worksheet below. These are
        financial/business tools — for claims help, a free VSO has you covered.
      </div>
      {VAULT.map((item) => (
        <VaultCard key={item.slug} item={item} />
      ))}
    </div>
  );
}

function VaultCard({ item }: { item: VaultItem }) {
  return (
    <div className="brief-card space-y-3">
      <div>
        <h3 className="text-lg font-bold">{item.title}</h3>
        <p className="text-sm text-olive-400">{item.summary}</p>
      </div>
      <ul className="space-y-2">
        {item.lines.map((line, i) => {
          if (line.kind === "note") {
            return (
              <li key={i} className="text-xs italic text-olive-400">
                ★ {line.label}
              </li>
            );
          }
          if (line.kind === "check") {
            return (
              <li key={i} className="flex items-center gap-2 text-sm">
                <span className="inline-block h-4 w-4 shrink-0 rounded border border-base-600" />
                {line.label}
              </li>
            );
          }
          return (
            <li key={i} className="text-sm">
              <span className="text-olive-400">{line.label}:</span>
              <span className="ml-2 inline-block min-w-[8rem] border-b border-base-600 align-bottom">
                &nbsp;
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
