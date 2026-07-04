import type { Metadata } from "next";
import { PlaybookContent } from "@/components/PlaybookContent";
import { resolveEntitlement } from "@/lib/tiers";
import { getAccountState } from "@/lib/account";

export const metadata: Metadata = {
  title: "The Playbook — the Vault",
  description:
    "One-time $27 unlock: fill-in worksheets, lender and rental scripts, the freedom-number worksheet, and the home-service business launch kit — plus unlimited AI and community.",
};

export default async function PlaybookPage() {
  const account = await getAccountState();
  const ent = resolveEntitlement(account);

  return (
    <div className="space-y-5">
      <div>
        <p className="field-label">Section 07 · The Vault</p>
        <h1 className="mt-1 text-3xl font-bold">The Playbook</h1>
        <p className="mt-2 max-w-2xl text-olive-400">
          The field manual, made actionable. Every tool in the app is free — this
          is the fill-in Vault behind them, on the wealth-building side. Buy it
          once, keep it for life.
        </p>
      </div>
      <PlaybookContent unlocked={ent.hasPlaybook} />
    </div>
  );
}
