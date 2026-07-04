"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { buildBriefing, type Briefing } from "@/lib/benefits";
import type { VetProfile } from "@/data/benefits-catalog";
import { BriefingView } from "@/components/BriefingView";

interface StoredProfile extends VetProfile {
  firstName?: string;
}

export function Dashboard() {
  const [profile, setProfile] = useState<StoredProfile | null>(null);
  const [briefing, setBriefing] = useState<Briefing | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("mtff-profile");
      if (raw) {
        const p = JSON.parse(raw) as StoredProfile;
        setProfile(p);
        setBriefing(buildBriefing(p));
      }
    } catch {
      /* ignore */
    }
    setReady(true);
  }, []);

  if (!ready) return null;

  if (!profile || !briefing) {
    return (
      <div className="brief-card space-y-3">
        <p>You haven&apos;t built your briefing yet.</p>
        <Link href="/onboarding" className="btn-primary w-fit">
          Start your 90-second intake
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-3 sm:grid-cols-3">
        <QuickLink href="/calculator" label="Rating calculator" note="See the VA math" />
        <QuickLink href="/tracker" label="Claim tracker" note="Where's my claim?" />
        <QuickLink href="/chat" label="Battle Buddy" note="Ask anything" />
      </div>
      <BriefingView briefing={briefing} firstName={profile.firstName} />
    </div>
  );
}

function QuickLink({ href, label, note }: { href: string; label: string; note: string }) {
  return (
    <Link href={href} className="brief-card block hover:border-signal-500">
      <p className="font-semibold">{label}</p>
      <p className="text-sm text-olive-400">{note}</p>
    </Link>
  );
}
