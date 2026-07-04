import type { Metadata } from "next";
import Link from "next/link";
import { HouseHackPlanner } from "@/components/HouseHackPlanner";
import { EducationWarGamer } from "@/components/EducationWarGamer";
import { RoadmapBoard } from "@/components/RoadmapBoard";
import { IncomeTrackers } from "@/components/IncomeTrackers";
import { PLAYBOOK_PRICE } from "@/lib/tiers";

export const metadata: Metadata = {
  title: "Financial Freedom Command Center",
  description:
    "Free VA-loan house-hack planner, GI Bill vs VR&E war-gamer, the 24-month roadmap with a Freedom Score, and income trackers. The MTFF playbook, made interactive.",
};

export default function CommandCenterPage() {
  return (
    <div className="space-y-8">
      <div>
        <p className="field-label">Section 05 · The Playbook</p>
        <h1 className="mt-1 text-3xl font-bold">
          Financial Freedom Command Center
        </h1>
        <p className="mt-2 max-w-2xl text-olive-400">
          The wealth-building half of the field manual — and it&apos;s all free.
          These are general-education tools, not individualized financial advice.
          Want the fill-in worksheets, scripts, and deep guides behind them?{" "}
          <Link href="/playbook" className="text-signal-400 underline">
            The Playbook ({PLAYBOOK_PRICE}, one-time)
          </Link>{" "}
          unlocks the Vault.
        </p>
      </div>

      <section id="va-loan" className="scroll-mt-24 space-y-3">
        <h2 className="text-xl font-bold">VA Loan House-Hack Planner</h2>
        <p className="text-sm text-olive-400">
          $0 down, funding-fee exempt for most disabled vets. Buy a 2–4 unit, live
          in one, rent the rest, and see what you actually pay to live.
        </p>
        <HouseHackPlanner />
      </section>

      <section id="education" className="scroll-mt-24 space-y-3">
        <h2 className="text-xl font-bold">GI Bill vs VR&E War-Gamer</h2>
        <p className="text-sm text-olive-400">
          Don&apos;t burn a benefit before you compare them. Model both side by side.
        </p>
        <EducationWarGamer />
      </section>

      <section id="roadmap" className="scroll-mt-24 space-y-3">
        <h2 className="text-xl font-bold">24-Month Roadmap &amp; Freedom Score</h2>
        <p className="text-sm text-olive-400">
          The book&apos;s plan as check-off missions across the 5 income pillars.
        </p>
        <RoadmapBoard />
      </section>

      <section id="income" className="scroll-mt-24 space-y-3">
        <h2 className="text-xl font-bold">Income Pillar Trackers</h2>
        <p className="text-sm text-olive-400">
          Log benefit, rental, and business income — see the gap to your freedom
          number close month by month.
        </p>
        <IncomeTrackers />
      </section>
    </div>
  );
}
