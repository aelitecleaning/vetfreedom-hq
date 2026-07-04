import { NextRequest, NextResponse } from "next/server";
import { getStripe, isStripeConfigured, PRICE_IDS } from "@/lib/stripe";
import { createServerClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

// One-time Stripe Checkout for the Playbook. No subscriptions in this model.
export async function POST(req: NextRequest) {
  if (!isStripeConfigured()) {
    return NextResponse.json({ error: "The Playbook isn't on sale yet — check back soon." }, { status: 503 });
  }

  const { plan } = (await req.json().catch(() => ({}))) as { plan?: "playbook" };
  if (plan !== "playbook" || !PRICE_IDS.playbook) {
    return NextResponse.json({ error: "Unknown product" }, { status: 400 });
  }

  const site = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

  // Attach the signed-in user so the webhook can unlock the right account.
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
    mode: "payment",
    line_items: [{ price: PRICE_IDS.playbook, quantity: 1 }],
    customer_email: email,
    client_reference_id: userId,
    metadata: { plan: "playbook", userId: userId ?? "" },
    success_url: `${site}/playbook?unlocked=1`,
    cancel_url: `${site}/pricing?canceled=1`,
    allow_promotion_codes: true,
  });

  return NextResponse.json({ url: session.url });
}
