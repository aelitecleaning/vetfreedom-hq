import { NextRequest, NextResponse } from "next/server";
import { getStripe, isStripeConfigured, PRICE_IDS } from "@/lib/stripe";
import { createServerClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

// Creates a Stripe Checkout session for a chosen plan. Monthly/annual are
// subscriptions; founding is a one-time payment.
export async function POST(req: NextRequest) {
  if (!isStripeConfigured()) {
    return NextResponse.json({ error: "Billing isn't configured yet." }, { status: 503 });
  }

  const { plan } = (await req.json().catch(() => ({}))) as {
    plan?: "monthly" | "annual" | "founding";
  };
  const priceId = plan ? PRICE_IDS[plan] : "";
  if (!priceId) {
    return NextResponse.json({ error: "Unknown plan" }, { status: 400 });
  }

  const site = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

  // Attach the signed-in user so the webhook can upgrade the right account.
  let userId: string | undefined;
  let email: string | undefined;
  try {
    const supabase = createServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    userId = user?.id;
    email = user?.email ?? undefined;
  } catch {
    /* anonymous checkout still works; account linked by email */
  }

  const stripe = getStripe();
  const session = await stripe.checkout.sessions.create({
    mode: plan === "founding" ? "payment" : "subscription",
    line_items: [{ price: priceId, quantity: 1 }],
    customer_email: email,
    client_reference_id: userId,
    metadata: { plan: plan ?? "", userId: userId ?? "" },
    success_url: `${site}/dashboard?upgraded=1`,
    cancel_url: `${site}/pricing?canceled=1`,
    allow_promotion_codes: true,
  });

  return NextResponse.json({ url: session.url });
}
