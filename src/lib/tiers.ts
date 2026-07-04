// Monetization model: FREE tools + a single ONE-TIME "Playbook" unlock.
//
// Every interactive tool (calculator, tracker, AI, Command Center planners) is
// free for everyone. The only paid thing is a one-time purchase — "The Playbook"
// ($27, lifetime) — which unlocks a premium CONTENT area (financial worksheets,
// templates, deep guides, community) and lifts the AI daily cap.
//
// COMPLIANCE NOTE: nothing claims-related is ever paid, and the paid content is
// strictly the FINANCIAL-FREEDOM side — never claim preparation. See
// src/data/vault.ts, which intentionally contains no claim documents.

export type Tier = "free" | "playbook";

export interface Entitlement {
  tier: Tier;
  /** Bought the one-time Playbook → premium content + unlimited AI. */
  hasPlaybook: boolean;
  unlimitedAi: boolean;
  aiDailyCap: number; // messages/day before you need the Playbook (or tomorrow)
}

export const FREE_AI_DAILY_CAP = 10;
export const PLAYBOOK_PRICE = "$27";

// During the free launch (FREE_FOR_ALL=true) everyone gets the Playbook content
// unlocked so the whole app is explorable. Flip to false to start selling it.
export function freeForAll(): boolean {
  return (process.env.FREE_FOR_ALL ?? "true").toLowerCase() === "true";
}

export interface AccountState {
  tier: Tier;
  /** Early adopters keep Playbook content for 90 days after launch ends. */
  grandfatheredUntil?: string | null;
}

export function resolveEntitlement(account: AccountState): Entitlement {
  const grandfathered =
    account.grandfatheredUntil != null &&
    new Date(account.grandfatheredUntil).getTime() > Date.now();

  const hasPlaybook =
    freeForAll() || grandfathered || account.tier === "playbook";

  return {
    tier: account.tier,
    hasPlaybook,
    unlimitedAi: hasPlaybook,
    aiDailyCap: FREE_AI_DAILY_CAP,
  };
}

// The only gated surface is premium content — never the tools.
export type PremiumFeature = "vault" | "premium-guides" | "community" | "unlimited-ai";

export function isPremium(feature: PremiumFeature, ent: Entitlement): boolean {
  return feature === "unlimited-ai" ? ent.unlimitedAi : ent.hasPlaybook;
}

export const OFFER = {
  free: {
    name: "Everything, free",
    price: "$0",
    priceNote: "No credit card, forever",
    blurb:
      "Every tool in the app: the rating calculator, claim tracker, C&P education, benefits briefing, the VA-loan and school-benefit planners, the 24-month roadmap, and daily AI help.",
    features: [
      "VA combined-rating calculator",
      "Claim journey tracker + reminders",
      "C&P exam education",
      "Benefits briefing",
      "VA-loan house-hack planner",
      "GI Bill vs VR&E war-gamer",
      "24-month roadmap + Freedom Score",
      "Income trackers",
      `${FREE_AI_DAILY_CAP} AI messages / day`,
    ],
  },
  playbook: {
    name: "The Playbook",
    price: PLAYBOOK_PRICE,
    priceNote: "One time · lifetime access",
    blurb:
      "The field manual, made actionable inside the app. Unlocks the Vault — fill-in worksheets, scripts, and deep guides for VA-loan deals, the home-service business, and hitting your freedom number — plus unlimited AI and the private community.",
    features: [
      "The Vault: house-hack deal analyzer, freedom-number worksheet, business launch kit",
      "Lender & rental scripts you can copy",
      "Deep written guides (VA loan, house-hacking, business)",
      "Unlimited Battle Buddy AI",
      "Private community access",
      "Every future Playbook update, free",
    ],
  },
} as const;
