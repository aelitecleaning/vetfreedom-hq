// Server-side Supabase clients. Two flavors:
//  - createServerClient(): request-scoped, respects the signed-in user + RLS.
//  - createAdminClient(): service-role, bypasses RLS. Use ONLY in trusted server
//    code (webhooks, metering) and never expose the service key to the browser.

import { cookies } from "next/headers";
import {
  createServerClient as createSsrClient,
  type CookieOptions,
} from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";

const URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const ANON = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

export function createServerClient() {
  const cookieStore = cookies();
  return createSsrClient(URL, ANON, {
    cookies: {
      get(name: string) {
        return cookieStore.get(name)?.value;
      },
      set(name: string, value: string, options: CookieOptions) {
        try {
          cookieStore.set({ name, value, ...options });
        } catch {
          // set() throws in Server Components; middleware handles refresh.
        }
      },
      remove(name: string, options: CookieOptions) {
        try {
          cookieStore.set({ name, value: "", ...options });
        } catch {
          /* no-op in Server Components */
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
