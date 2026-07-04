"use client";

import { useMemo, useState } from "react";
import { totalEducationValue, type EduInput } from "@/lib/finance";

// Side-by-side GI Bill (Ch.33) vs VR&E (Ch.31) modeler. Inputs are editable —
// we don't hardcode benefit amounts (they change yearly). General education.
export function EducationWarGamer() {
  const [gi, setGi] = useState<EduInput>({
    months: 36,
    monthlyHousing: 2200,
    tuitionPerYear: 26000,
    booksPerYear: 1000,
  });
  const [vre, setVre] = useState<EduInput>({
    months: 48,
    monthlyHousing: 2200,
    tuitionPerYear: 26000,
    booksPerYear: 1200,
  });

  const giR = useMemo(() => totalEducationValue(gi), [gi]);
  const vreR = useMemo(() => totalEducationValue(vre), [vre]);

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <Column
          title="Post-9/11 GI Bill (Ch.33)"
          who="Most veterans with qualifying service."
          input={gi}
          onChange={setGi}
          total={giR.grandTotal}
        />
        <Column
          title="VR&E (Ch.31)"
          who="Veterans with a service-connected disability and an employment need. Often more generous — and doesn't burn GI Bill months."
          input={vre}
          onChange={setVre}
          total={vreR.grandTotal}
        />
      </div>
      <div className="brief-card border-signal-600">
        <p className="field-label">Modeled total value over the program</p>
        <p className="mt-1 text-sm text-olive-400">
          GI Bill ≈{" "}
          <span className="font-bold text-sand">${giR.grandTotal.toLocaleString()}</span>{" "}
          · VR&E ≈{" "}
          <span className="font-bold text-sand">${vreR.grandTotal.toLocaleString()}</span>
          . These are your editable estimates — verify eligibility and current
          rates on VA.gov. VR&E eligibility is individual; a VR&E counselor or a
          free accredited VSO can confirm yours.
        </p>
      </div>
    </div>
  );
}

function Column({
  title,
  who,
  input,
  onChange,
  total,
}: {
  title: string;
  who: string;
  input: EduInput;
  onChange: (i: EduInput) => void;
  total: number;
}) {
  const set = (patch: Partial<EduInput>) => onChange({ ...input, ...patch });
  return (
    <div className="brief-card space-y-3">
      <div>
        <h3 className="font-bold">{title}</h3>
        <p className="text-xs text-olive-400">{who}</p>
      </div>
      <Row label="Months of benefit" value={input.months} onChange={(v) => set({ months: v })} />
      <Row label="Monthly housing ($)" value={input.monthlyHousing} onChange={(v) => set({ monthlyHousing: v })} />
      <Row label="Tuition / year ($)" value={input.tuitionPerYear} onChange={(v) => set({ tuitionPerYear: v })} />
      <Row label="Books / year ($)" value={input.booksPerYear} onChange={(v) => set({ booksPerYear: v })} />
      <div className="border-t border-base-700 pt-2">
        <p className="field-label">Modeled total</p>
        <p className="text-2xl font-bold text-signal-400">${total.toLocaleString()}</p>
      </div>
    </div>
  );
}

function Row({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <label className="flex items-center justify-between gap-2 text-sm">
      <span className="text-olive-400">{label}</span>
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(Number(e.target.value) || 0)}
        className="min-h-[44px] w-28 rounded-md border border-base-700 bg-base-950 px-2"
      />
    </label>
  );
}
