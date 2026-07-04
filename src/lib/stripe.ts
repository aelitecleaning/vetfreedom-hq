// Server-side Stripe helper. Lazily constructed so the app can boot (and the
// free calculator/tracker still work) even before Stripe keys are configured.

import Stripe from "stripe";

let cached: Stripe | null = null;

export function getStripe(): Stripe {
  if (!cached) {
    const key = process.env.STRIPE_SECRET_KEY;
    if (!key) throw new Error("STRIPE_SECRET_KEY is not set");
    cached = new Stripe(key, { apiVersion: "2024-09-30.acacia" });
  }
  return cached;
}

export function isStripeConfigured(): boolean {
  return Boolean(process.env.STRIPE_SECRET_KEY);
}

export const PRICE_IDS = {
  monthly: process.env.NEXT_PUBLIC_STRIPE_PRICE_MONTHLY ?? "",
  annual: process.env.NEXT_PUBLIC_STRIPE_PRICE_ANNUAL ?? "",
  founding: process.env.NEXT_PUBLIC_STRIPE_PRICE_FOUNDING ?? "",
};
