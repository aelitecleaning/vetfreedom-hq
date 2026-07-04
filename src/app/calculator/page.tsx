import type { Metadata } from "next";
import { RatingCalculator } from "@/components/RatingCalculator";

export const metadata: Metadata = {
  title: "VA Disability Combined-Rating Calculator (2026)",
  description:
    "Free VA combined disability rating calculator with bilateral factor, dependents, and 2026 compensation estimates. Shows the VA's own math — no login required.",
};

export default function CalculatorPage() {
  return (
    <div className="space-y-5">
      <div>
        <p className="field-label">Section 02 · The Math</p>
        <h1 className="mt-1 text-3xl font-bold">
          VA Combined-Rating Calculator
        </h1>
        <p className="mt-2 max-w-2xl text-olive-400">
          VA disability ratings don&apos;t add up the way you&apos;d expect — two
          50% ratings make 75%, not 100%. Enter your ratings below to see the
          combined result, the bilateral factor, and an estimate of your monthly
          compensation. Free, no login. This shows the VA&apos;s math; it
          doesn&apos;t predict what any condition &quot;should&quot; be rated.
        </p>
      </div>
      <RatingCalculator />
    </div>
  );
}
