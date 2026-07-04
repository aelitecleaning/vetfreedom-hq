"use client";

import { useState } from "react";
import { buildBriefing } from "@/lib/benefits";
import type { SeparationStatus, VetProfile } from "@/data/benefits-catalog";
import { BriefingView } from "@/components/BriefingView";
import { DisclaimerBlock } from "@/components/Disclaimer";
import { track } from "@/lib/analytics";

const BRANCHES = ["Army", "Navy", "Air Force", "Marines", "Coast Guard", "Space Force"];
const RATINGS = ["not-rated", "0", "10", "20", "30", "40", "50", "60", "70", "80", "90", "100"];
const GOALS: { key: string; label: string }[] = [
  { key: "rating", label: "Increase my rating" },
  { key: "house", label: "Buy a house" },
  { key: "school", label: "Use school benefits" },
  { key: "business", label: "Start a business" },
];

export function Onboarding() {
  const [step, setStep] = useState(0);
  const [firstName, setFirstName] = useState("");
  const [branch, setBranch] = useState("Army");
  const [status, setStatus] = useState<SeparationStatus>("out");
  const [rating, setRating] = useState<string>("not-rated");
  const [hasSpouse, setHasSpouse] = useState(false);
  const [goals, setGoals] = useState<string[]>([]);
  const [accepted, setAccepted] = useState(false);
  const [done, setDone] = useState(false);

  function toggleGoal(k: string) {
    setGoals((g) => (g.includes(k) ? g.filter((x) => x !== k) : [...g, k]));
  }

  function finish() {
    void track("signup", { branch, status });
    // Persist locally so the dashboard/briefing can read it without requiring
    // an account during the free launch. (Server persistence happens on login.)
    const profile: VetProfile = {
      branch,
      status,
      ratingPct: rating === "not-rated" ? null : Number(rating),
      hasSpouse,
      goals,
    };
    try {
      localStorage.setItem("mtff-profile", JSON.stringify({ ...profile, firstName }));
    } catch {
      /* ignore storage errors */
    }
    setDone(true);
  }

  if (done) {
    const profile: VetProfile = {
      branch,
      status,
      ratingPct: rating === "not-rated" ? null : Number(rating),
      hasSpouse,
      goals,
    };
    return <BriefingView briefing={buildBriefing(profile)} firstName={firstName} />;
  }

  return (
    <div className="mx-auto max-w-xl space-y-6">
      <div className="flex items-center gap-2">
        {[0, 1, 2].map((s) => (
          <div
            key={s}
            className={`h-1.5 flex-1 rounded ${
              s <= step ? "bg-signal-500" : "bg-base-700"
            }`}
          />
        ))}
      </div>

      {step === 0 && (
        <div className="brief-card space-y-4">
          <p className="field-label">Step 1 · Who&apos;s reporting</p>
          <label className="block text-sm">
            First name (optional)
            <input
              className="mt-1 min-h-[44px] w-full rounded-md border border-base-700 bg-base-950 px-3"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="Drew"
            />
          </label>
          <label className="block text-sm">
            Branch
            <select
              className="mt-1 min-h-[44px] w-full rounded-md border border-base-700 bg-base-950 px-3"
              value={branch}
              onChange={(e) => setBranch(e.target.value)}
            >
              {BRANCHES.map((b) => (
                <option key={b}>{b}</option>
              ))}
            </select>
          </label>
          <fieldset className="text-sm">
            <legend className="mb-1">Where are you now?</legend>
            <div className="grid gap-2">
              {(
                [
                  ["active", "Still serving"],
                  ["transitioning", "Transitioning out (next 12 mo)"],
                  ["out", "Already a veteran"],
                ] as [SeparationStatus, string][]
              ).map(([val, label]) => (
                <label
                  key={val}
                  className={`flex min-h-[44px] cursor-pointer items-center gap-2 rounded-md border px-3 ${
                    status === val ? "border-signal-500 bg-base-800" : "border-base-700"
                  }`}
                >
                  <input
                    type="radio"
                    name="status"
                    checked={status === val}
                    onChange={() => setStatus(val)}
                  />
                  {label}
                </label>
              ))}
            </div>
          </fieldset>
          <button className="btn-primary w-full" onClick={() => setStep(1)}>
            Next
          </button>
        </div>
      )}

      {step === 1 && (
        <div className="brief-card space-y-4">
          <p className="field-label">Step 2 · Your status</p>
          <label className="block text-sm">
            Current VA disability rating
            <select
              className="mt-1 min-h-[44px] w-full rounded-md border border-base-700 bg-base-950 px-3"
              value={rating}
              onChange={(e) => setRating(e.target.value)}
            >
              <option value="not-rated">Not rated yet</option>
              {RATINGS.filter((r) => r !== "not-rated").map((r) => (
                <option key={r} value={r}>
                  {r}%
                </option>
              ))}
            </select>
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              className="h-5 w-5"
              checked={hasSpouse}
              onChange={(e) => setHasSpouse(e.target.checked)}
            />
            I have a spouse (affects comp estimate at 30%+)
          </label>
          <p className="text-xs text-olive-400">
            We only ask what we need to tailor your briefing. No SSN, no VA file
            number, no medical records — ever.
          </p>
          <div className="flex gap-2">
            <button className="btn-ghost flex-1" onClick={() => setStep(0)}>
              Back
            </button>
            <button className="btn-primary flex-1" onClick={() => setStep(2)}>
              Next
            </button>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="brief-card space-y-4">
          <p className="field-label">Step 3 · Your objectives</p>
          <div className="grid grid-cols-2 gap-2">
            {GOALS.map((g) => (
              <button
                key={g.key}
                onClick={() => toggleGoal(g.key)}
                aria-pressed={goals.includes(g.key)}
                className={`min-h-[44px] rounded-md border px-3 py-2 text-sm ${
                  goals.includes(g.key)
                    ? "border-signal-500 bg-base-800 text-sand"
                    : "border-base-700 text-olive-400"
                }`}
              >
                {g.label}
              </button>
            ))}
          </div>

          <DisclaimerBlock compact />
          <label className="flex items-start gap-2 text-sm">
            <input
              type="checkbox"
              className="mt-1 h-5 w-5"
              checked={accepted}
              onChange={(e) => setAccepted(e.target.checked)}
            />
            I understand MTFF is an educational tool — not a VSO, law firm, or
            VA-accredited rep — and it never files or prepares my claim.
          </label>

          <div className="flex gap-2">
            <button className="btn-ghost flex-1" onClick={() => setStep(1)}>
              Back
            </button>
            <button
              className="btn-primary flex-1 disabled:opacity-40"
              disabled={!accepted}
              onClick={finish}
            >
              Build my briefing →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
