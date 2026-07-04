import type { Metadata } from "next";
import { ClaimTracker } from "@/components/ClaimTracker";
import { DisclaimerBlock } from "@/components/Disclaimer";

export const metadata: Metadata = {
  title: "Claim Journey Tracker",
  description:
    "Track your VA claim through the 8 official stages, with plain-English education at each step and reminders for your C&P exam and deadlines. You log it; we never connect to VA.gov or touch your records.",
};

export default function TrackerPage() {
  return (
    <div className="space-y-5">
      <div>
        <p className="field-label">Section 03 · The Journey</p>
        <h1 className="mt-1 text-3xl font-bold">Claim Journey Tracker</h1>
        <p className="mt-2 max-w-2xl text-olive-400">
          Log your own claim and see exactly where it sits in the VA&apos;s 8-stage
          process — what usually happens next and what you can do about it. Free
          forever. We store only what you type: no SSN, no VA login, no records.
        </p>
      </div>
      <DisclaimerBlock compact />
      <ClaimTracker />
    </div>
  );
}
