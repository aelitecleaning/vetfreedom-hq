import { NextRequest, NextResponse } from "next/server";
import type Stripe from "stripe";
import { getStripe, isStripeConfigured } from "@/lib/stripe";
import { createAdminClient, isSupabaseConfigured } from "@/lib/supabase/server";

export const runtime = "nodejs";

// Stripe sends the raw body; we must verify the signature against the raw bytes.
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
    switch (event.type) {
      case "checkout.session.completed": {
        const s = event.data.object as Stripe.Checkout.Session;
        const plan = s.metadata?.plan;
        const tier = plan === "founding" ? "founding" : "field-grade";
        await upgradeAccount({
          userId: s.client_reference_id ?? s.metadata?.userId ?? null,
          email: s.customer_details?.email ?? s.customer_email ?? null,
          customerId: typeof s.customer === "string" ? s.customer : null,
          tier,
        });
        break;
      }
      case "customer.subscription.deleted": {
        const sub = event.data.object as Stripe.Subscription;
        await downgradeByCustomer(
          typeof sub.customer === "string" ? sub.customer : null
        );
        break;
      }
      default:
        break;
    }
  } catch (err) {
    console.error("Webhook handler error", err);
    return NextResponse.json({ error: "handler error" }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}

async function upgradeAccount(args: {
  userId: string | null;
  email: string | null;
  customerId: string | null;
  tier: "field-grade" | "founding";
}) {
  if (!isSupabaseConfigured()) return;
  const admin = createAdminClient();
  const patch = {
    tier: args.tier,
    stripe_customer_id: args.customerId,
    grandfathered_until: null,
  };
  if (args.userId) {
    await admin.from("profiles").update(patch).eq("id", args.userId);
  } else if (args.email) {
    await admin.from("profiles").update(patch).eq("email", args.email);
  }
}

async function downgradeByCustomer(customerId: string | null) {
  if (!isSupabaseConfigured() || !customerId) return;
  const admin = createAdminClient();
  await admin
    .from("profiles")
    .update({ tier: "recruit" })
    .eq("stripe_customer_id", customerId);
}
