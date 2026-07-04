// Builds the Day-0 "Benefits Left on the Table" briefing from a veteran's
// onboarding profile. This is the instant-win screen: half of all subscription
// conversions happen on day one, so this must deliver value in the first session.

import { lookupCompensation, NO_DEPENDENTS } from "@/lib/va/comp";
import {
  surfaceBenefits,
  type Benefit,
  type VetProfile,
} from "@/data/benefits-catalog";

export interface Mission {
  title: string;
  detail: string;
  href: string;
}

export interface Briefing {
  headline: string;
  monthlyEstimate: number | null;
  annualEstimate: number | null;
  ratesEffective: string | null;
  benefits: Benefit[];
  missions: Mission[];
  ratingKnown: boolean;
}

export function buildBriefing(profile: VetProfile): Briefing {
  const ratingKnown = profile.ratingPct !== null && profile.ratingPct > 0;

  let monthlyEstimate: number | null = null;
  let annualEstimate: number | null = null;
  let ratesEffective: string | null = null;

  if (ratingKnown) {
    const comp = lookupCompensation(profile.ratingPct as number, {
      ...NO_DEPENDENTS,
      spouse: profile.hasSpouse,
    });
    monthlyEstimate = comp.monthly;
    annualEstimate = comp.annual;
    ratesEffective = comp.ratesEffective;
  }

  const benefits = surfaceBenefits(profile);
  const missions = pickMissions(profile);

  const headline = ratingKnown
    ? `At ${profile.ratingPct}%, here's what you've earned — and what you may be leaving on the table.`
    : `You're not rated yet. Here's the ground you can take — for free.`;

  return {
    headline,
    monthlyEstimate,
    annualEstimate,
    ratesEffective,
    benefits,
    missions,
    ratingKnown,
  };
}

// The next 3 recommended "missions," ranked by the veteran's stated goals.
function pickMissions(profile: VetProfile): Mission[] {
  const all: Record<string, Mission> = {
    rating: {
      title: "Understand your rating math",
      detail:
        "See how the VA combines your ratings (it's not simple addition) and what each condition adds.",
      href: "/calculator",
    },
    file: {
      title: "Learn the claim process — then get a free VSO",
      detail:
        "Walk the 8 claim stages in the tracker. When you're ready to file or appeal, a free accredited VSO represents you at no cost.",
      href: "/tracker",
    },
    house: {
      title: "Run your VA loan house-hack numbers",
      detail:
        "No down payment, funding-fee exemption, and a duplex where rent covers the mortgage. Model it in the Command Center.",
      href: "/command-center#va-loan",
    },
    school: {
      title: "War-game GI Bill vs VR&E before you spend a month",
      detail:
        "VR&E can be more generous than the GI Bill and may not burn your GI Bill months. Compare side-by-side.",
      href: "/command-center#education",
    },
    business: {
      title: "Start the Business Launch missions",
      detail:
        "The home-service business pillar — how a disabled vet turns skills into monthly income.",
      href: "/command-center#roadmap",
    },
    ask: {
      title: "Ask Battle Buddy anything",
      detail:
        "Free educational answers on claims, C&P exams, VA loans, and school benefits — 24/7.",
      href: "/chat",
    },
  };

  const ordered: Mission[] = [];
  for (const g of profile.goals) {
    if (all[g] && !ordered.includes(all[g])) ordered.push(all[g]);
  }
  // Always make sure the claim-process mission and the AI are reachable.
  for (const fallback of ["file", "rating", "ask"]) {
    if (ordered.length >= 3) break;
    if (!ordered.includes(all[fallback])) ordered.push(all[fallback]);
  }
  return ordered.slice(0, 3);
}
