import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import "./globals.css";
import { SiteNav } from "@/components/SiteNav";
import { SiteFooter } from "@/components/SiteFooter";

// Friendly, human typography: Poppins for headings/labels, Inter for body.
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-stencil",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Military to Financial Freedom — Freedom HQ",
    template: "%s · Military to Financial Freedom",
  },
  description:
    "The interactive field manual for veterans: track your VA claim, learn how benefits work, and build income after service. Educational tool — not a VSO or law firm.",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"
  ),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      data-font="default"
      className={`${inter.variable} ${poppins.variable}`}
    >
      <body className="min-h-screen">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded focus:bg-signal-500 focus:px-4 focus:py-2 focus:text-sand"
        >
          Skip to content
        </a>
        <SiteNav />
        <main id="main" className="mx-auto max-w-brief px-5 py-8">
          {children}
        </main>
        <SiteFooter />
      </body>
    </html>
  );
}
