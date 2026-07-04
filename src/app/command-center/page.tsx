import type { Metadata } from "next";
import { HouseHackPlanner } from "@/components/HouseHackPlanner";
import { EducationWarGamer } from "@/components/EducationWarGamer";
import { RoadmapBoard } from "@/components/RoadmapBoard";
import { IncomeTrackers } from "@/components/IncomeTrackers";
import { PaidGate } from "@/components/PaidGate";
import { resolveEntitlement } from "@/lib/tiers";
import { getAccountState } from "@/lib/account";

export const metadata: Metadata = {
  title: "Financial Freedom Command Center",
  description:
    "VA loan house-hack planner, GI Bill vs VR&E war-gamer, the 24-month roadmap with a Freedom Score, and income trackers. The MTFF playbook, made interactive.",
};

export default async function CommandCenterPage() {
  const account = await getAccountState();
  const ent = resolveEntitlement(account);

  return (
    <div className="space-y-8">
      <div>
        <p className="field-label">Section 05 · The Playbook</p>
        <h1 className="mt-1 text-3xl font-bold">
          Financial Freedom Command Center
        </h1>
        <p className="mt-2 max-w-2xl text-olive-400">
          This is the wealth-building half of the field manual — the part paid
          membership funds. Everything here is general education, not individualized
          financial advice.
        </p>
      </div>

      <section id="va-loan" className="scroll-mt-24 space-y-3">
        <h2 className="text-xl font-bold">VA Loan House-Hack Planner</h2>
        <p className="text-sm text-olive-400">
          $0 down, funding-fee exempt for most disabled vets. Buy a 2–4 unit, live
          in one, rent the rest, and see what you actually pay to live.
        </p>
        <PaidGate entitled={ent.commandCenter}>
          <HouseHackPlanner />
        </PaidGate>
      </section>

      <section id="education" className="scroll-mt-24 space-y-3">
        <h2 className="text-xl font-bold">GI Bill vs VR&E War-Gamer</h2>
        <p className="text-sm text-olive-400">
          Don&apos;t burn a benefit before you compare them. Model both side by side.
        </p>
        <PaidGate entitled={ent.commandCenter}>
          <EducationWarGamer />
        </PaidGate>
      </section>

      <section id="roadmap" className="scroll-mt-24 space-y-3">
        <h2 className="text-xl font-bold">24-Month Roadmap &amp; Freedom Score</h2>
        <p className="text-sm text-olive-400">
          The book&apos;s plan as check-off missions across the 5 income pillars.
        </p>
        <PaidGate entitled={ent.commandCenter}>
          <RoadmapBoard />
        </PaidGate>
      </section>

      <section id="income" className="scroll-mt-24 space-y-3">
        <h2 className="text-xl font-bold">Income Pillar Trackers</h2>
        <p className="text-sm text-olive-400">
          Log benefit, rental, and business income — see the gap to your freedom
          number close month by month.
        </p>
        <PaidGate entitled={ent.commandCenter}>
          <IncomeTrackers />
        </PaidGate>
      </section>
    </div>
  );
}
