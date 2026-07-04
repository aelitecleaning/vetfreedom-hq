import type { Metadata } from "next";
import { Onboarding } from "@/components/Onboarding";

export const metadata: Metadata = {
  title: "Start free — 90-second benefits briefing",
  description:
    "Answer a few quick questions and get your personalized VA benefits briefing: estimated compensation, benefits you may be missing, and your next 3 moves.",
};

export default function OnboardingPage() {
  return (
    <div className="space-y-5">
      <div>
        <p className="field-label">Section 01 · Intake</p>
        <h1 className="mt-1 text-3xl font-bold">
          90 seconds to your benefits briefing
        </h1>
        <p className="mt-2 max-w-2xl text-olive-400">
          No credit card. No SSN. Just enough to show you what you&apos;ve earned
          and what you may be leaving on the table.
        </p>
      </div>
      <Onboarding />
    </div>
  );
}
