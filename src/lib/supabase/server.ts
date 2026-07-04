// Server-side Supabase clients. Two flavors:
//  - createServerClient(): request-scoped, respects the signed-in user + RLS.
//  - createAdminClient(): service-role, bypasses RLS. Use ONLY in trusted server
//    code (webhooks, metering) and never expose the service key to the browser.

import { cookies } from "next/headers";
import { createServerClient as createSsrClient } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";

const URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const ANON = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

export function createServerClient() {
  const cookieStore = cookies();
  return createSsrClient(URL, ANON, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      // Param typed explicitly (strict mode won't infer it) and options passed
      // through loosely — cookie option shapes differ across lib versions.
      setAll(
        cookiesToSet: { name: string; value: string; options?: Record<string, unknown> }[]
      ) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            cookieStore.set(name, value, options as any)
          );
        } catch {
          // setAll() throws in Server Components; middleware handles refresh.
        }
      },
    },
  });
}

export function createAdminClient() {
  const serviceRole = process.env.SUPABASE_SERVICE_ROLE ?? "";
  return createClient(URL, serviceRole, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

export function isSupabaseConfigured(): boolean {
  return Boolean(URL && ANON);
}
