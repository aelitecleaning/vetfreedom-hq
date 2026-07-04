// Server-side Stripe helper. Lazily constructed so the app can boot (and the
// free calculator/tracker still work) even before Stripe keys are configured.

import Stripe from "stripe";

let cached: Stripe | null = null;

export function getStripe(): Stripe {
  if (!cached) {
    const key = process.env.STRIPE_SECRET_KEY;
    if (!key) throw new Error("STRIPE_SECRET_KEY is not set");
    // Let the SDK use its own pinned API version. Hard-coding a version string
    // couples us to the exact installed package and breaks the type-check on
    // upgrades — the account/SDK default is the safe choice.
    cached = new Stripe(key);
  }
  return cached;
}

export function isStripeConfigured(): boolean {
  return Boolean(process.env.STRIPE_SECRET_KEY);
}

// One-time purchase only — no subscriptions in this model.
export const PRICE_IDS = {
  playbook: process.env.NEXT_PUBLIC_STRIPE_PRICE_PLAYBOOK ?? "",
};
