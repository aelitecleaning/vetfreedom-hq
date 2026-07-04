import { NextRequest, NextResponse } from "next/server";
import { createServerClient, isSupabaseConfigured } from "@/lib/supabase/server";

export const runtime = "nodejs";

const ALLOWED = new Set([
  "signup",
  "briefing_completed",
  "calculator_used",
  "ai_message_sent",
  "upgrade_clicked",
  "tracker_claim_added",
]);

// Privacy-light analytics sink. Drops unknown events, attaches user id only if
// present, and never fails loudly (analytics must not break the UX).
export async function POST(req: NextRequest) {
  try {
    const { event, props } = (await req.json()) as {
      event: string;
      props?: Record<string, unknown>;
    };
    if (!ALLOWED.has(event)) {
      return NextResponse.json({ ok: false }, { status: 204 });
    }
    if (!isSupabaseConfigured()) return NextResponse.json({ ok: true });

    const supabase = createServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    await supabase.from("analytics_events").insert({
      event,
      props: props ?? {},
      user_id: user?.id ?? null,
    });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: true });
  }
}
