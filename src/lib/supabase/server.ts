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
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
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
