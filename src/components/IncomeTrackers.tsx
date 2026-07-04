"use client";

import { useEffect, useMemo, useState } from "react";

// Simple monthly income logging across the pillars → one view of the gap to the
// veteran's "freedom number" (monthly cost of living). Educational self-tracking,
// stored locally. Not financial advice.
interface Income {
  benefits: number;
  rentals: number;
  business: number;
  other: number;
  freedomNumber: number;
}

const STORAGE_KEY = "mtff-income";
const DEFAULT: Income = {
  benefits: 0,
  rentals: 0,
  business: 0,
  other: 0,
  freedomNumber: 5000,
};

export function IncomeTrackers() {
  const [inc, setInc] = useState<Income>(DEFAULT);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setInc({ ...DEFAULT, ...JSON.parse(raw) });
    } catch {
      /* ignore */
    }
  }, []);

  function set(patch: Partial<Income>) {
    const next = { ...inc, ...patch };
    setInc(next);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      /* ignore */
    }
  }

  const total = useMemo(
    () => inc.benefits + inc.rentals + inc.business + inc.other,
    [inc]
  );
  const gap = inc.freedomNumber - total;
  const pct = inc.freedomNumber > 0 ? Math.min(100, Math.round((total / inc.freedomNumber) * 100)) : 0;

  const bars: { label: string; value: number; key: keyof Income }[] = [
    { label: "VA benefits", value: inc.benefits, key: "benefits" },
    { label: "Rental income", value: inc.rentals, key: "rentals" },
    { label: "Business income", value: inc.business, key: "business" },
    { label: "Other", value: inc.other, key: "other" },
  ];

  return (
    <div className="grid gap-4 lg:grid-cols-[1fr,320px]">
      <div className="brief-card space-y-3">
        {bars.map((b) => (
          <label key={b.key} className="flex items-center justify-between gap-3 text-sm">
            <span className="text-olive-400">{b.label} ($/mo)</span>
            <input
              type="number"
              min={0}
              value={b.value}
              onChange={(e) => set({ [b.key]: Number(e.target.value) || 0 } as Partial<Income>)}
              className="min-h-[44px] w-32 rounded-md border border-base-700 bg-base-950 px-2"
            />
          </label>
        ))}
        <label className="flex items-center justify-between gap-3 border-t border-base-700 pt-3 text-sm">
          <span className="text-olive-400">Your freedom number ($/mo cost of living)</span>
          <input
            type="number"
            min={0}
            value={inc.freedomNumber}
            onChange={(e) => set({ freedomNumber: Number(e.target.value) || 0 })}
            className="min-h-[44px] w-32 rounded-md border border-base-700 bg-base-950 px-2"
          />
        </label>
      </div>

      <aside className="brief-card space-y-3 border-signal-600">
        <div>
          <p className="field-label">Monthly income</p>
          <p className="text-3xl font-bold">${total.toLocaleString()}</p>
        </div>
        <div className="h-3 w-full rounded bg-base-700">
          <div className="h-3 rounded bg-signal-500 transition-all" style={{ width: `${pct}%` }} />
        </div>
        <p className="text-sm text-olive-400">
          {gap <= 0 ? (
            <span className="font-semibold text-olive-400">
              You&apos;ve hit your freedom number. Everything past here is momentum.
            </span>
          ) : (
            <>
              <span className="font-semibold text-signal-400">${gap.toLocaleString()}/mo</span>{" "}
              to go until your income covers your cost of living.
            </>
          )}
        </p>
        {/* Simple stacked composition */}
        <div className="flex h-4 overflow-hidden rounded">
          {bars.map((b, i) =>
            b.value > 0 ? (
              <div
                key={b.key}
                title={`${b.label}: $${b.value}`}
                style={{ width: `${total ? (b.value / total) * 100 : 0}%` }}
                className={
                  ["bg-olive-500", "bg-signal-500", "bg-olive-400", "bg-signal-600"][i]
                }
              />
            ) : null
          )}
        </div>
      </aside>
    </div>
  );
}
