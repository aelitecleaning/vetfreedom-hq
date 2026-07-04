"use client";

import Link from "next/link";
import { useEffect } from "react";
import type { Briefing } from "@/lib/benefits";
import { track } from "@/lib/analytics";

// Renders the Day-0 "Benefits Left on the Table" briefing. Designed to be
// screenshot/share-friendly (the #briefing-card node is what an export would
// capture) — that's the organic growth loop.
export function BriefingView({
  briefing,
  firstName,
}: {
  briefing: Briefing;
  firstName?: string;
}) {
  useEffect(() => {
    void track("briefing_completed", {
      rating: briefing.ratingKnown ? "known" : "unknown",
    });
  }, [briefing.ratingKnown]);

  return (
    <div className="space-y-6">
      <div id="briefing-card" className="brief-card space-y-5 border-signal-600 bg-base-900">
        <div className="flex items-center justify-between">
          <p className="field-label">Mission Brief</p>
          <p className="font-stencil text-xs text-olive-400">
            {firstName ? `PVT ${firstName.toUpperCase()}` : "VETERAN"}
          </p>
        </div>

        <h2 className="text-2xl font-bold">{briefing.headline}</h2>

        {briefing.ratingKnown && (
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-md border border-base-700 bg-base-950 p-4">
              <p className="field-label">Est. monthly comp</p>
              <p className="mt-1 text-3xl font-bold text-signal-400">
                ${briefing.monthlyEstimate?.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                })}
              </p>
            </div>
            <div className="rounded-md border border-base-700 bg-base-950 p-4">
              <p className="field-label">Per year</p>
              <p className="mt-1 text-3xl font-bold">
                ${briefing.annualEstimate?.toLocaleString()}
              </p>
            </div>
          </div>
        )}

        <div>
          <p className="field-label mb-2">Benefits worth checking</p>
          <ul className="space-y-2">
            {briefing.benefits.map((b) => (
              <li
                key={b.key}
                className="rounded-md border border-base-700 bg-base-950 p-3"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold text-sand">{b.name}</p>
                    <p className="text-sm text-olive-400">{b.blurb}</p>
                  </div>
                  <a
                    href={b.source}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="shrink-0 text-xs text-signal-400 underline"
                  >
                    VA.gov →
                  </a>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <p className="text-xs text-olive-400">
          Estimates only — verify every figure and eligibility on VA.gov. This is
          educational, not advice, and not a promise of any benefit or rating.
        </p>
      </div>

      <div>
        <p className="field-label mb-2">Your next 3 missions</p>
        <div className="grid gap-3 sm:grid-cols-3">
          {briefing.missions.map((m, i) => (
            <Link
              key={i}
              href={m.href}
              className="brief-card block transition-colors hover:border-signal-500"
            >
              <p className="font-stencil text-xs text-signal-400">
                MISSION {i + 1}
              </p>
              <p className="mt-1 font-semibold">{m.title}</p>
              <p className="mt-1 text-sm text-olive-400">{m.detail}</p>
            </Link>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        <Link href="/dashboard" className="btn-primary">
          Go to Freedom HQ
        </Link>
        <button
          className="btn-ghost"
          onClick={() => {
            const text = `My VA benefits briefing from Military to Financial Freedom${
              briefing.ratingKnown
                ? ` — est. $${briefing.monthlyEstimate?.toLocaleString()}/mo`
                : ""
            }. Free tool for vets: `;
            if (navigator.share) {
              void navigator.share({
                title: "Military to Financial Freedom",
                text,
                url: "https://militarytofinancialfreedom.com",
              });
            } else {
              void navigator.clipboard.writeText(
                text + "https://militarytofinancialfreedom.com"
              );
              alert("Copied a shareable summary to your clipboard.");
            }
          }}
        >
          Share my briefing
        </button>
      </div>
    </div>
  );
}
