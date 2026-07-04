import Link from "next/link";
import { freeForAll } from "@/lib/tiers";

// Wraps paid Command Center tools. During the free launch (FREE_FOR_ALL=true)
// everything is open. NOTE: this gate is only ever used on FINANCIAL-FREEDOM
// tools — never on claims features, which stay free by law and by design.
export function PaidGate({
  entitled,
  children,
}: {
  entitled: boolean;
  children: React.ReactNode;
}) {
  if (entitled || freeForAll()) return <>{children}</>;

  return (
    <div className="brief-card space-y-3 border-signal-600 text-center">
      <p className="field-label text-signal-400">Field Grade tool</p>
      <p className="text-olive-400">
        This is part of the Financial Freedom Command Center. Your calculator,
        claim tracker, and C&P education stay free forever — this planner is a
        member tool.
      </p>
      <Link href="/pricing" className="btn-primary mx-auto w-fit">
        See membership — from $9.97/mo
      </Link>
    </div>
  );
}
