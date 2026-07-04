import type { Metadata } from "next";
import { PricingTable } from "@/components/PricingTable";
import { freeForAll, PLAYBOOK_PRICE } from "@/lib/tiers";

export const metadata: Metadata = {
  title: "Pricing — free tools + a one-time Playbook",
  description:
    "Every tool is free, forever. One optional one-time purchase — the Playbook ($27) — unlocks the financial-freedom Vault, unlimited AI, and the community. No subscriptions.",
};

export default function PricingPage() {
  return (
    <div className="space-y-5">
      <div>
        <p className="field-label">Section 06 · What it costs</p>
        <h1 className="mt-1 text-3xl font-bold">Free tools. One optional unlock.</h1>
        <p className="mt-2 max-w-2xl text-olive-400">
          No monthly fees, ever. Use everything free. If you want the fill-in
          Vault and the deep guides, grab the Playbook once for {PLAYBOOK_PRICE} and
          keep it for life.
        </p>
        {freeForAll() && (
          <p className="mt-3 rounded-md border border-signal-600 bg-base-900 p-3 text-sm text-signal-400">
            🎖️ Launch special: the Playbook Vault is unlocked for everyone right now
            while we build it out. Sign up early and you keep it grandfathered when
            it goes paid.
          </p>
        )}
      </div>
      <PricingTable />
    </div>
  );
}
