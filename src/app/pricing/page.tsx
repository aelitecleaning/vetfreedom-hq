import type { Metadata } from "next";
import { PricingTable } from "@/components/PricingTable";
import { freeForAll } from "@/lib/tiers";

export const metadata: Metadata = {
  title: "Membership & pricing",
  description:
    "Free forever for everything claims-related. Field Grade membership ($9.97/mo or $79/yr) unlocks the wealth-building tools. Founding lifetime access for the first 100.",
};

export default function PricingPage() {
  return (
    <div className="space-y-5">
      <div>
        <p className="field-label">Section 06 · Membership</p>
        <h1 className="mt-1 text-3xl font-bold">Pick your loadout</h1>
        <p className="mt-2 max-w-2xl text-olive-400">
          The claims tools are free for every veteran, always. Membership funds the
          build and unlocks the financial-freedom playbook.
        </p>
        {freeForAll() && (
          <p className="mt-3 rounded-md border border-signal-600 bg-base-900 p-3 text-sm text-signal-400">
            🎖️ Free launch is live: every account has full Field Grade access right
            now. Sign up early and you&apos;ll keep it grandfathered for 90 days when
            paid tiers turn on.
          </p>
        )}
      </div>
      <PricingTable />
    </div>
  );
}
