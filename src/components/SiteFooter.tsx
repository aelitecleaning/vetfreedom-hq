import Link from "next/link";
import { DisclaimerBlock } from "./Disclaimer";

export function SiteFooter() {
  return (
    <footer className="mt-16 border-t border-base-800 bg-base-950">
      <div className="mx-auto max-w-brief px-5 py-10">
        <DisclaimerBlock />
        <div className="mt-6 flex flex-col gap-4 text-sm text-olive-400 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-stencil uppercase tracking-widest">
            Military → Financial Freedom
          </p>
          <nav className="flex flex-wrap gap-x-5 gap-y-2">
            <Link href="/calculator">Rating calculator</Link>
            <Link href="/playbook">The Playbook</Link>
            <Link href="/pricing">Pricing</Link>
            <Link href="/roadmap">Roadmap</Link>
            <a
              href="https://militarytofinancialfreedom.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              The book
            </a>
          </nav>
        </div>
        <p className="mt-6 text-xs text-base-600">
          © {"2026"} Military to Financial Freedom. Not affiliated with, endorsed
          by, or connected to the U.S. Department of Veterans Affairs or any
          government agency.
        </p>
      </div>
    </footer>
  );
}
