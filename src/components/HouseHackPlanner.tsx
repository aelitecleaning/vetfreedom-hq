"use client";

import { useMemo, useState } from "react";
import { analyzeHouseHack, type HouseHackInput } from "@/lib/finance";

export function HouseHackPlanner() {
  const [i, setI] = useState<HouseHackInput>({
    price: 350_000,
    ratePct: 6.5,
    years: 30,
    units: 2,
    rentPerUnit: 1500,
    taxesInsMonthly: 650,
  });
  const set = (patch: Partial<HouseHackInput>) => setI({ ...i, ...patch });
  const r = useMemo(() => analyzeHouseHack(i), [i]);

  return (
    <div className="grid gap-4 lg:grid-cols-[1fr,320px]">
      <div className="brief-card grid gap-3 sm:grid-cols-2">
        <Field label="Purchase price ($)" value={i.price} onChange={(v) => set({ price: v })} />
        <Field label="Interest rate (%)" value={i.ratePct} step={0.1} onChange={(v) => set({ ratePct: v })} />
        <Field label="Loan term (years)" value={i.years} onChange={(v) => set({ years: v })} />
        <Field label="Total units (you live in 1)" value={i.units} min={1} max={4} onChange={(v) => set({ units: v })} />
        <Field label="Rent per rented unit ($/mo)" value={i.rentPerUnit} onChange={(v) => set({ rentPerUnit: v })} />
        <Field label="Taxes + ins + maint ($/mo)" value={i.taxesInsMonthly} onChange={(v) => set({ taxesInsMonthly: v })} />
        <p className="sm:col-span-2 text-xs text-olive-400">
          Modeled as a $0-down VA loan with the funding fee waived (typical for
          veterans receiving compensation). Educational estimate — confirm real
          numbers with a VA-savvy lender.
        </p>
      </div>

      <aside className="brief-card space-y-3 border-signal-600">
        <Stat label="Loan amount ($0 down)" value={`$${r.loanAmount.toLocaleString()}`} />
        <Stat label="Principal + interest" value={`$${r.piMonthly.toLocaleString()}/mo`} />
        <Stat label="Total housing cost" value={`$${r.totalHousingMonthly.toLocaleString()}/mo`} />
        <Stat label={`Rent from ${r.rentedUnits} unit(s)`} value={`$${r.rentIncome.toLocaleString()}/mo`} />
        <div className="border-t border-base-700 pt-3">
          <p className="field-label">Your net housing cost</p>
          <p className={`text-3xl font-bold ${r.netOutOfPocket <= 0 ? "text-olive-400" : "text-signal-400"}`}>
            {r.netOutOfPocket <= 0
              ? `+$${Math.abs(r.netOutOfPocket).toLocaleString()}/mo`
              : `$${r.netOutOfPocket.toLocaleString()}/mo`}
          </p>
          <p className="text-sm text-olive-400">
            Rent covers {r.coversPct}% of your housing cost.
            {r.netOutOfPocket <= 0 && " That's cash flow while you live there."}
          </p>
        </div>
      </aside>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  step = 1,
  min = 0,
  max,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  step?: number;
  min?: number;
  max?: number;
}) {
  return (
    <label className="block text-sm">
      <span className="text-olive-400">{label}</span>
      <input
        type="number"
        value={value}
        step={step}
        min={min}
        max={max}
        onChange={(e) => onChange(Number(e.target.value) || 0)}
        className="mt-1 min-h-[44px] w-full rounded-md border border-base-700 bg-base-950 px-3"
      />
    </label>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-olive-400">{label}</span>
      <span className="font-semibold">{value}</span>
    </div>
  );
}
