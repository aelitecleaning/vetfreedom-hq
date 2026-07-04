import { NextRequest, NextResponse } from "next/server";
import type Stripe from "stripe";
import { getStripe, isStripeConfigured } from "@/lib/stripe";
import { createAdminClient, isSupabaseConfigured } from "@/lib/supabase/server";

export const runtime = "nodejs";

// Stripe sends the raw body; we verify the signature against the raw bytes.
// One-time Playbook purchase → set the account's tier to "playbook" (lifetime).
export async function POST(req: NextRequest) {
  if (!isStripeConfigured()) {
    return NextResponse.json({ received: true, note: "stripe not configured" });
  }

  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  const sig = req.headers.get("stripe-signature");
  const raw = await req.text();

  let event: Stripe.Event;
  try {
    event = getStripe().webhooks.constructEvent(raw, sig ?? "", secret ?? "");
  } catch (err) {
    console.error("Webhook signature verification failed", err);
    return NextResponse.json({ error: "Bad signature" }, { status: 400 });
  }

  try {
    if (event.type === "checkout.session.completed") {
      const s = event.data.object as Stripe.Checkout.Session;
      await unlockPlaybook({
        userId: s.client_reference_id ?? s.metadata?.userId ?? null,
        email: s.customer_details?.email ?? s.customer_email ?? null,
        customerId: typeof s.customer === "string" ? s.customer : null,
      });
    }
  } catch (err) {
    console.error("Webhook handler error", err);
    return NextResponse.json({ error: "handler error" }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}

async function unlockPlaybook(args: {
  userId: string | null;
  email: string | null;
  customerId: string | null;
}) {
  if (!isSupabaseConfigured()) return;
  const admin = createAdminClient();
  const patch = {
    tier: "playbook",
    stripe_customer_id: args.customerId,
    grandfathered_until: null,
  };
  if (args.userId) {
    await admin.from("profiles").update(patch).eq("id", args.userId);
  } else if (args.email) {
    await admin.from("profiles").update(patch).eq("email", args.email);
  }
}
