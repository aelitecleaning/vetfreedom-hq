"use client";

import { useMemo, useState } from "react";
import {
  computeCombinedRating,
  type Disability,
} from "@/lib/va/combined-ratings";
import { lookupCompensation, type Dependents } from "@/lib/va/comp";
import { track } from "@/lib/analytics";

interface Row {
  id: number;
  percent: number;
  bilateral: boolean;
  bilateralGroup: string;
}

let nextId = 1;
const newRow = (): Row => ({
  id: nextId++,
  percent: 10,
  bilateral: false,
  bilateralGroup: "legs",
});

const STEPS = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100];

export function RatingCalculator() {
  const [rows, setRows] = useState<Row[]>([newRow()]);
  const [dep, setDep] = useState<Dependents>({
    spouse: false,
    childrenUnder18: 0,
    childrenInSchool: 0,
    parents: 0,
    spouseAidAndAttendance: false,
  });
  const [showMath, setShowMath] = useState(false);

  const result = useMemo(() => {
    const disabilities: Disability[] = rows.map((r) => ({
      percent: r.percent,
      bilateralGroup: r.bilateral ? r.bilateralGroup : undefined,
    }));
    const combined = computeCombinedRating(disabilities);
    const comp = lookupCompensation(combined.rounded, dep);
    return { combined, comp };
  }, [rows, dep]);

  function update(id: number, patch: Partial<Row>) {
    setRows((rs) => rs.map((r) => (r.id === id ? { ...r, ...patch } : r)));
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr,340px]">
      <div className="space-y-4">
        <div className="brief-card space-y-4">
          <div className="flex items-center justify-between">
            <p className="field-label">Your disabilities</p>
            <button
              className="btn-ghost text-sm"
              onClick={() => setRows((rs) => [...rs, newRow()])}
            >
              + Add disability
            </button>
          </div>

          <div className="space-y-3">
            {rows.map((r, idx) => (
              <div
                key={r.id}
                className="rounded-md border border-base-700 bg-base-950 p-3"
              >
                <div className="flex flex-wrap items-center gap-3">
                  <span className="font-stencil text-xs text-olive-400">
                    #{idx + 1}
                  </span>
                  <label className="sr-only" htmlFor={`pct-${r.id}`}>
                    Rating percent for disability {idx + 1}
                  </label>
                  <select
                    id={`pct-${r.id}`}
                    value={r.percent}
                    onChange={(e) =>
                      update(r.id, { percent: Number(e.target.value) })
                    }
                    className="min-h-[44px] rounded-md border border-base-700 bg-base-900 px-3 text-sand"
                  >
                    {STEPS.map((s) => (
                      <option key={s} value={s}>
                        {s}%
                      </option>
                    ))}
                  </select>

                  <label className="flex items-center gap-2 text-sm text-olive-400">
                    <input
                      type="checkbox"
                      checked={r.bilateral}
                      onChange={(e) =>
                        update(r.id, { bilateral: e.target.checked })
                      }
                      className="h-5 w-5"
                    />
                    Bilateral (paired limbs)
                  </label>

                  {r.bilateral && (
                    <select
                      aria-label="Bilateral group"
                      value={r.bilateralGroup}
                      onChange={(e) =>
                        update(r.id, { bilateralGroup: e.target.value })
                      }
                      className="min-h-[44px] rounded-md border border-base-700 bg-base-900 px-3 text-sand"
                    >
                      <option value="legs">Legs / lower</option>
                      <option value="arms">Arms / upper</option>
                    </select>
                  )}

                  {rows.length > 1 && (
                    <button
                      className="ml-auto text-sm text-olive-400 underline"
                      onClick={() =>
                        setRows((rs) => rs.filter((x) => x.id !== r.id))
                      }
                    >
                      Remove
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
          <p className="text-xs text-olive-400">
            Bilateral factor: tag disabilities affecting <em>both</em> arms or
            <em> both</em> legs with the same group. The VA adds a 10% factor to
            those before combining (38 CFR § 4.26).
          </p>
        </div>

        <div className="brief-card space-y-3">
          <p className="field-label">Dependents (affect pay at 30%+)</p>
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                className="h-5 w-5"
                checked={dep.spouse}
                onChange={(e) => setDep({ ...dep, spouse: e.target.checked })}
              />
              Married (spouse)
            </label>
            <NumberField
              label="Children under 18"
              value={dep.childrenUnder18}
              onChange={(v) => setDep({ ...dep, childrenUnder18: v })}
            />
            <NumberField
              label="Children 18+ in school"
              value={dep.childrenInSchool}
              onChange={(v) => setDep({ ...dep, childrenInSchool: v })}
            />
            <NumberField
              label="Dependent parents"
              value={dep.parents}
              max={2}
              onChange={(v) => setDep({ ...dep, parents: v })}
            />
          </div>
        </div>
      </div>

      {/* Result panel */}
      <aside className="space-y-3">
        <div className="brief-card sticky top-20 space-y-4 border-signal-600">
          <div>
            <p className="field-label">Combined VA rating</p>
            <p className="mt-1 text-5xl font-bold text-signal-400">
              {result.combined.rounded}%
            </p>
            <p className="text-xs text-olive-400">
              Exact combined value {result.combined.exact.toFixed(1)}% before
              rounding to the nearest 10.
            </p>
          </div>
          <div className="border-t border-base-700 pt-3">
            <p className="field-label">Est. monthly compensation</p>
            <p className="mt-1 text-3xl font-bold">
              ${result.comp.monthly.toLocaleString(undefined, {
                minimumFractionDigits: 2,
              })}
            </p>
            <p className="text-sm text-olive-400">
              ≈ ${result.comp.annual.toLocaleString()} / year
            </p>
          </div>
          <button
            className="text-left text-sm text-signal-400 underline"
            onClick={() => {
              setShowMath((s) => !s);
              void track("calculator_used", { rating: result.combined.rounded });
            }}
          >
            {showMath ? "Hide the VA math" : "Show me the VA math"}
          </button>
          {showMath && (
            <ol className="space-y-1 border-t border-base-700 pt-3 text-xs text-olive-400">
              {result.combined.steps.map((s, i) => (
                <li key={i}>• {s}</li>
              ))}
              {result.comp.breakdown.map((s, i) => (
                <li key={`c-${i}`}>• {s}</li>
              ))}
            </ol>
          )}
          <p className="border-t border-base-700 pt-3 text-xs text-olive-400">
            {result.comp.disclaimer} Rates effective{" "}
            {result.comp.ratesEffective}.
          </p>
        </div>
      </aside>
    </div>
  );
}

function NumberField({
  label,
  value,
  onChange,
  max = 20,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  max?: number;
}) {
  return (
    <label className="flex items-center justify-between gap-2 text-sm">
      <span className="text-olive-400">{label}</span>
      <input
        type="number"
        min={0}
        max={max}
        value={value}
        onChange={(e) =>
          onChange(Math.max(0, Math.min(max, Number(e.target.value) || 0)))
        }
        className="min-h-[44px] w-20 rounded-md border border-base-700 bg-base-900 px-2 text-sand"
      />
    </label>
  );
}
