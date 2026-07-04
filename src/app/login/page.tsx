"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

// Magic-link + Google sign-in. Auth is optional during the free launch — the
// calculator, tracker, and briefing all work signed-out (stored locally). Login
// is for saving across devices and, later, managing membership.
export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function sendMagicLink(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    try {
      const supabase = createClient();
      const site =
        process.env.NEXT_PUBLIC_SITE_URL ??
        (typeof window !== "undefined" ? window.location.origin : "");
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: { emailRedirectTo: `${site}/auth/callback` },
      });
      if (error) setError(error.message);
      else setSent(true);
    } catch {
      setError("Sign-in isn't configured yet. You can still use every free tool.");
    }
  }

  async function google() {
    try {
      const supabase = createClient();
      const site =
        process.env.NEXT_PUBLIC_SITE_URL ??
        (typeof window !== "undefined" ? window.location.origin : "");
      await supabase.auth.signInWithOAuth({
        provider: "google",
        options: { redirectTo: `${site}/auth/callback` },
      });
    } catch {
      setError("Google sign-in isn't configured yet.");
    }
  }

  return (
    <div className="mx-auto max-w-md space-y-5">
      <div>
        <p className="field-label">Sign in</p>
        <h1 className="mt-1 text-3xl font-bold">Save your progress</h1>
        <p className="mt-2 text-olive-400">
          Optional — every free tool works without an account. Sign in to sync
          across devices and manage membership.
        </p>
      </div>

      {sent ? (
        <div className="brief-card">
          <p className="text-sand">Check your email for a magic link. 📬</p>
        </div>
      ) : (
        <form onSubmit={sendMagicLink} className="brief-card space-y-3">
          <label className="block text-sm">
            Email
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 min-h-[44px] w-full rounded-md border border-base-700 bg-base-950 px-3"
              placeholder="you@email.com"
            />
          </label>
          <button type="submit" className="btn-primary w-full">
            Email me a magic link
          </button>
          <button type="button" onClick={google} className="btn-ghost w-full">
            Continue with Google
          </button>
        </form>
      )}

      {error && <p className="text-sm text-signal-400">{error}</p>}
    </div>
  );
}
