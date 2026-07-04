import { createServerClient, isSupabaseConfigured } from "@/lib/supabase/server";
import type { AccountState } from "@/lib/tiers";

// Resolves the current account's tier/grandfather state on the server. Degrades
// to a free "recruit" account when Supabase isn't configured or nobody's signed
// in — during the free launch (FREE_FOR_ALL) that still resolves to full access.
export async function getAccountState(): Promise<AccountState> {
  if (!isSupabaseConfigured()) return { tier: "recruit", grandfatheredUntil: null };

  try {
    const supabase = createServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return { tier: "recruit", grandfatheredUntil: null };

    const { data } = await supabase
      .from("profiles")
      .select("tier, grandfathered_until")
      .eq("id", user.id)
      .maybeSingle();

    return {
      tier: (data?.tier as AccountState["tier"]) ?? "recruit",
      grandfatheredUntil: data?.grandfathered_until ?? null,
    };
  } catch {
    return { tier: "recruit", grandfatheredUntil: null };
  }
}
