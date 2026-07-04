import { NextRequest, NextResponse } from "next/server";
import { createServerClient, isSupabaseConfigured } from "@/lib/supabase/server";

export const runtime = "nodejs";

// Exchanges the magic-link / OAuth code for a session, then redirects to the
// dashboard.
export async function GET(req: NextRequest) {
  const { searchParams, origin } = new URL(req.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/dashboard";

  if (code && isSupabaseConfigured()) {
    try {
      const supabase = createServerClient();
      await supabase.auth.exchangeCodeForSession(code);
    } catch {
      /* fall through to redirect */
    }
  }
  return NextResponse.redirect(`${origin}${next}`);
}
