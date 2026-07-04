"use client";

import { useEffect, useState } from "react";
import { CLAIM_STEPS, stepById } from "@/data/claim-steps";
import { track } from "@/lib/analytics";

// Self-service claim tracker. The veteran logs THEIR OWN claim details — labels,
// dates, and which of the 8 VA stages they're on. The app stores nothing but
// what they type (no uploaded records, no VA.gov connection). Reminders are
// computed from the dates they enter.

interface Claim {
  id: string;
  label: string;
  dateFiled: string;
  stepId: number;
  cpExamDate: string;
  itfDate: string;
  respondByDate: string;
}

const STORAGE_KEY = "mtff-claims";

function loadClaims(): Claim[] {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]");
  } catch {
    return [];
  }
}

function newClaim(): Claim {
  return {
    id: Math.random().toString(36).slice(2),
    label: "",
    dateFiled: "",
    stepId: 1,
    cpExamDate: "",
    itfDate: "",
    respondByDate: "",
  };
}

export function ClaimTracker() {
  const [claims, setClaims] = useState<Claim[]>([]);
  const [editing, setEditing] = useState<Claim | null>(null);

  useEffect(() => setClaims(loadClaims()), []);

  function persist(next: Claim[]) {
    setClaims(next);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      /* ignore */
    }
  }

  function save(claim: Claim) {
    const exists = claims.some((c) => c.id === claim.id);
    const next = exists
      ? claims.map((c) => (c.id === claim.id ? claim : c))
      : [...claims, claim];
    persist(next);
    if (!exists) void track("tracker_claim_added");
    setEditing(null);
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <p className="field-label">Your claims</p>
        <button className="btn-primary text-sm" onClick={() => setEditing(newClaim())}>
          + Track a claim
        </button>
      </div>

      {claims.length === 0 && !editing && (
        <div className="brief-card text-olive-400">
          <p>
            Nothing tracked yet. Add a claim to see where it sits in the VA&apos;s
            8-stage process, what usually happens next, and what you can do — plus
            reminders for your C&P exam and deadlines.
          </p>
        </div>
      )}

      <div className="space-y-4">
        {claims.map((c) => (
          <ClaimCard key={c.id} claim={c} onEdit={() => setEditing(c)} />
        ))}
      </div>

      {editing && (
        <ClaimForm
          claim={editing}
          onCancel={() => setEditing(null)}
          onSave={save}
          onDelete={
            claims.some((c) => c.id === editing.id)
              ? () => persist(claims.filter((c) => c.id !== editing.id))
              : undefined
          }
        />
      )}
    </div>
  );
}

function reminders(c: Claim): string[] {
  const out: string[] = [];
  const soon = (d: string) => {
    if (!d) return false;
    const days = (new Date(d).getTime() - Date.now()) / 86_400_000;
    return days >= 0 && days <= 30;
  };
  if (soon(c.cpExamDate)) out.push(`C&P exam on ${c.cpExamDate} — show up and be honest & complete.`);
  if (soon(c.respondByDate)) out.push(`VA response due ${c.respondByDate} — don't miss it.`);
  if (c.itfDate) {
    const expiry = new Date(c.itfDate);
    expiry.setFullYear(expiry.getFullYear() + 1);
    const days = (expiry.getTime() - Date.now()) / 86_400_000;
    if (days >= 0 && days <= 60)
      out.push(
        `Your Intent to File (${c.itfDate}) protects your effective date for 1 year — it expires around ${expiry
          .toISOString()
          .slice(0, 10)}. File before then.`
      );
  }
  return out;
}

function ClaimCard({ claim, onEdit }: { claim: Claim; onEdit: () => void }) {
  const step = stepById(claim.stepId);
  const rem = reminders(claim);
  return (
    <div className="brief-card space-y-3">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-lg font-bold">{claim.label || "Untitled claim"}</h3>
          {claim.dateFiled && (
            <p className="text-xs text-olive-400">Filed {claim.dateFiled}</p>
          )}
        </div>
        <button className="text-sm text-signal-400 underline" onClick={onEdit}>
          Edit
        </button>
      </div>

      {/* Progress through the 8 stages */}
      <div className="flex gap-1" aria-label={`Stage ${claim.stepId} of 8`}>
        {CLAIM_STEPS.map((s) => (
          <div
            key={s.id}
            title={s.title}
            className={`h-2 flex-1 rounded ${
              s.id <= claim.stepId ? "bg-signal-500" : "bg-base-700"
            }`}
          />
        ))}
      </div>

      {step && (
        <div className="rounded-md border border-base-700 bg-base-950 p-3 text-sm">
          <p className="font-semibold text-sand">
            Stage {step.id}/8 — {step.title}
          </p>
          <p className="mt-1 text-olive-400">{step.whatItMeans}</p>
          <p className="mt-2">
            <span className="field-label">Usually: </span>
            <span className="text-olive-400">{step.whatUsuallyHappens}</span>
          </p>
          <p className="mt-1">
            <span className="field-label">You can: </span>
            <span className="text-olive-400">{step.whatYouCanDo}</span>
          </p>
          <a
            className="mt-2 inline-block text-xs text-signal-400 underline"
            href={step.source}
            target="_blank"
            rel="noopener noreferrer"
          >
            VA.gov source →
          </a>
        </div>
      )}

      {rem.length > 0 && (
        <div className="rounded-md border border-signal-600 bg-base-950 p-3">
          <p className="field-label text-signal-400">Reminders</p>
          <ul className="mt-1 space-y-1 text-sm text-sand">
            {rem.map((r, i) => (
              <li key={i}>• {r}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

function ClaimForm({
  claim,
  onSave,
  onCancel,
  onDelete,
}: {
  claim: Claim;
  onSave: (c: Claim) => void;
  onCancel: () => void;
  onDelete?: () => void;
}) {
  const [draft, setDraft] = useState<Claim>(claim);
  const set = (patch: Partial<Claim>) => setDraft({ ...draft, ...patch });

  return (
    <form
      className="brief-card space-y-3 border-signal-600"
      onSubmit={(e) => {
        e.preventDefault();
        onSave(draft);
      }}
    >
      <p className="field-label">
        {onDelete ? "Edit claim" : "Track a new claim"}
      </p>
      <label className="block text-sm">
        Condition / label
        <input
          required
          className="mt-1 min-h-[44px] w-full rounded-md border border-base-700 bg-base-950 px-3"
          value={draft.label}
          onChange={(e) => set({ label: e.target.value })}
          placeholder="e.g. Tinnitus increase, PTSD, lower back"
        />
      </label>
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="block text-sm">
          Date filed
          <input
            type="date"
            className="mt-1 min-h-[44px] w-full rounded-md border border-base-700 bg-base-950 px-3"
            value={draft.dateFiled}
            onChange={(e) => set({ dateFiled: e.target.value })}
          />
        </label>
        <label className="block text-sm">
          Current VA stage
          <select
            className="mt-1 min-h-[44px] w-full rounded-md border border-base-700 bg-base-950 px-3"
            value={draft.stepId}
            onChange={(e) => set({ stepId: Number(e.target.value) })}
          >
            {CLAIM_STEPS.map((s) => (
              <option key={s.id} value={s.id}>
                {s.id}. {s.title}
              </option>
            ))}
          </select>
        </label>
        <label className="block text-sm">
          C&P exam date (if any)
          <input
            type="date"
            className="mt-1 min-h-[44px] w-full rounded-md border border-base-700 bg-base-950 px-3"
            value={draft.cpExamDate}
            onChange={(e) => set({ cpExamDate: e.target.value })}
          />
        </label>
        <label className="block text-sm">
          Intent to File (ITF) date
          <input
            type="date"
            className="mt-1 min-h-[44px] w-full rounded-md border border-base-700 bg-base-950 px-3"
            value={draft.itfDate}
            onChange={(e) => set({ itfDate: e.target.value })}
          />
        </label>
        <label className="block text-sm sm:col-span-2">
          VA asked me to respond by (deadline)
          <input
            type="date"
            className="mt-1 min-h-[44px] w-full rounded-md border border-base-700 bg-base-950 px-3"
            value={draft.respondByDate}
            onChange={(e) => set({ respondByDate: e.target.value })}
          />
        </label>
      </div>

      <div className="flex flex-wrap gap-2">
        <button type="submit" className="btn-primary">
          Save
        </button>
        <button type="button" className="btn-ghost" onClick={onCancel}>
          Cancel
        </button>
        {onDelete && (
          <button
            type="button"
            className="ml-auto text-sm text-olive-400 underline"
            onClick={onDelete}
          >
            Delete claim
          </button>
        )}
      </div>
    </form>
  );
}
