import Link from "next/link";
import { FontToggle } from "./FontToggle";

export function SiteNav() {
  return (
    <header className="sticky top-0 z-30 border-b border-base-800 bg-base-950/90 backdrop-blur">
      <div className="mx-auto flex max-w-brief items-center justify-between px-5 py-3">
        <Link href="/" className="flex items-center gap-2">
          <span className="font-stencil text-lg uppercase tracking-widest text-signal-400">
            MTFF
          </span>
          <span className="hidden text-sm text-olive-400 sm:inline">
            Freedom HQ
          </span>
        </Link>
        <nav className="flex items-center gap-2 text-sm sm:gap-4">
          <Link href="/calculator" className="hidden hover:text-signal-400 sm:inline">
            Calculator
          </Link>
          <Link href="/tracker" className="hidden hover:text-signal-400 sm:inline">
            Claim Tracker
          </Link>
          <Link href="/chat" className="hidden hover:text-signal-400 sm:inline">
            Battle Buddy
          </Link>
          <Link href="/playbook" className="hover:text-signal-400">
            Playbook
          </Link>
          <FontToggle />
          <Link href="/onboarding" className="btn-primary text-sm">
            Start free
          </Link>
        </nav>
      </div>
    </header>
  );
}
