// Membership tiers + entitlement logic.
//
// COMPLIANCE NOTE: nothing claims-related is ever gated behind payment. The
// calculator, claim tracker, C&P education, and claims-mode AI answers work on
// the FREE tier for everyone. Paid tiers unlock the FINANCIAL-FREEDOM side
// (VA loan tools, GI Bill/VR&E planning, business roadmap, unlimited AI on those
// topics, community). See isPaidFeature() for the guarded surface.

export type Tier = "recruit" | "field-grade" | "founding";

export interface Entitlement {
  tier: Tier;
  /** Unlimited AI messages (paid) vs the free daily cap. */
  unlimitedAi: boolean;
  /** Access to the paid Financial Freedom Command Center tools. */
  commandCenter: boolean;
  aiDailyCap: number; // messages/day on the free tier
}

export const FREE_AI_DAILY_CAP = 5;

// During the free launch period (FREE_FOR_ALL=true), every account is treated as
// Field Grade. Flipping the env flag off begins paid enforcement.
export function freeForAll(): boolean {
  return (process.env.FREE_FOR_ALL ?? "true").toLowerCase() === "true";
}

export interface AccountState {
  tier: Tier;
  /** Early adopters who signed up during the free period get 90 days grandfathered. */
  grandfatheredUntil?: string | null;
}

export function resolveEntitlement(account: AccountState): Entitlement {
  const grandfathered =
    account.grandfatheredUntil != null &&
    new Date(account.grandfatheredUntil).getTime() > Date.now();

  const effectivelyPaid =
    freeForAll() ||
    grandfathered ||
    account.tier === "field-grade" ||
    account.tier === "founding";

  return {
    tier: account.tier,
    unlimitedAi: effectivelyPaid,
    commandCenter: effectivelyPaid,
    aiDailyCap: FREE_AI_DAILY_CAP,
  };
}

// Features that require a paid (or free-launch/grandfathered) entitlement. Note
// the absence of anything claims-related — that's intentional and legally load-
// bearing.
export type PaidFeature =
  | "command-center"
  | "va-loan-planner"
  | "education-wargamer"
  | "roadmap"
  | "income-trackers"
  | "unlimited-ai";

export function isPaidFeature(feature: PaidFeature, ent: Entitlement): boolean {
  if (feature === "unlimited-ai") return ent.unlimitedAi;
  return ent.commandCenter;
}

export const TIERS = {
  recruit: {
    name: "Recruit",
    price: "Free",
    priceNote: "No credit card",
    blurb:
      "Everything claims-related, forever free: rating calculator, claim tracker, C&P education, and 5 Battle Buddy messages a day.",
    features: [
      "VA combined-rating calculator",
      "Self-service claim journey tracker",
      "C&P exam education",
      "Benefits briefing",
      "5 AI messages / day",
    ],
  },
  fieldGrade: {
    name: "Field Grade",
    price: "$9.97/mo",
    priceNote: "or $79/year",
    blurb:
      "The whole financial-freedom playbook: VA loan & house-hacking tools, GI Bill vs VR&E war-gamer, the 24-month roadmap, income trackers, community, and unlimited AI.",
    features: [
      "Everything in Recruit",
      "Unlimited Battle Buddy",
      "VA loan house-hack planner",
      "GI Bill vs VR&E war-gamer",
      "24-month roadmap + Freedom Score",
      "Income pillar trackers",
      "Private community access",
    ],
  },
  founding: {
    name: "Founding Member",
    price: "$149 once",
    priceNote: "First 100 — lifetime",
    blurb:
      "Lifetime Field Grade access and a founder badge. Locks in everything, forever, and funds the build.",
    features: [
      "Lifetime Field Grade access",
      "Founder badge",
      "Direct input on the roadmap",
    ],
  },
} as const;
