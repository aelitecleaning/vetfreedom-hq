"use client";

import { useEffect, useState } from "react";
import { ROADMAP, PILLARS, type Pillar } from "@/data/roadmap";

const STORAGE_KEY = "mtff-roadmap-done";
const PHASES = [
  { n: 1, label: "Months 1–6 · Foundation" },
  { n: 2, label: "Months 7–12 · Position" },
  { n: 3, label: "Months 13–18 · Execute" },
  { n: 4, label: "Months 19–24 · Compound" },
];

const PILLAR_NAME = Object.fromEntries(PILLARS.map((p) => [p.key, p.name])) as Record<Pillar, string>;

export function RoadmapBoard() {
  const [done, setDone] = useState<Record<string, boolean>>({});

  useEffect(() => {
    try {
      setDone(JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "{}"));
    } catch {
      /* ignore */
    }
  }, []);

  function toggle(id: string) {
    setDone((d) => {
      const next = { ...d, [id]: !d[id] };
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {
        /* ignore */
      }
      return next;
    });
  }

  const completed = ROADMAP.filter((m) => done[m.id]).length;
  const score = Math.round((completed / ROADMAP.length) * 100);

  return (
    <div className="space-y-5">
      <div className="brief-card border-signal-600">
        <div className="flex items-center justify-between">
          <div>
            <p className="field-label">Freedom Score</p>
            <p className="text-sm text-olive-400">
              {completed} of {ROADMAP.length} missions complete
            </p>
          </div>
          <p className="text-4xl font-bold text-signal-400">{score}</p>
        </div>
        <div className="mt-3 h-2 w-full rounded bg-base-700">
          <div
            className="h-2 rounded bg-signal-500 transition-all"
            style={{ width: `${score}%` }}
          />
        </div>
      </div>

      {PHASES.map((phase) => (
        <div key={phase.n} className="space-y-2">
          <p className="field-label">{phase.label}</p>
          <div className="grid gap-2">
            {ROADMAP.filter((m) => m.phase === phase.n).map((m) => (
              <button
                key={m.id}
                onClick={() => toggle(m.id)}
                aria-pressed={!!done[m.id]}
                className={`flex items-start gap-3 rounded-md border p-3 text-left ${
                  done[m.id]
                    ? "border-olive-600 bg-base-800"
                    : "border-base-700 bg-base-950 hover:border-base-600"
                }`}
              >
                <span
                  className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded border text-xs ${
                    done[m.id]
                      ? "border-signal-500 bg-signal-500 text-sand"
                      : "border-base-600"
                  }`}
                  aria-hidden
                >
                  {done[m.id] ? "✓" : ""}
                </span>
                <span>
                  <span className="flex items-center gap-2">
                    <span className={`font-semibold ${done[m.id] ? "line-through opacity-70" : ""}`}>
                      {m.title}
                    </span>
                    <span className="rounded bg-base-700 px-1.5 py-0.5 font-stencil text-[10px] uppercase text-olive-400">
                      {PILLAR_NAME[m.pillar]}
                    </span>
                  </span>
                  <span className="mt-1 block text-sm text-olive-400">{m.detail}</span>
                </span>
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
