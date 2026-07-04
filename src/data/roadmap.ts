// The MTFF 24-month roadmap, organized by the book's 5 income pillars. Rendered
// as interactive missions in the Command Center; completing them drives the
// "Freedom Score." Content is educational and general — it is not individualized
// financial advice.

export type Pillar =
  | "va-loan"
  | "rentals"
  | "benefits"
  | "business"
  | "education";

export const PILLARS: { key: Pillar; name: string; blurb: string }[] = [
  { key: "benefits", name: "Benefits Mastery", blurb: "Know and use everything you earned." },
  { key: "va-loan", name: "VA Loan Wealth", blurb: "No-money-down real estate leverage." },
  { key: "rentals", name: "Rental Income", blurb: "House-hack into cash-flowing property." },
  { key: "business", name: "Home-Service Business", blurb: "Turn skills into monthly income." },
  { key: "education", name: "Education Leverage", blurb: "GI Bill / VR&E without waste." },
];

export interface Mission {
  id: string;
  pillar: Pillar;
  phase: 1 | 2 | 3 | 4; // 6-month phases across 24 months
  title: string;
  detail: string;
}

export const ROADMAP: Mission[] = [
  // Phase 1 (months 1–6): foundation
  { id: "b1", pillar: "benefits", phase: 1, title: "Pull your VA benefit letters", detail: "Download your rating decision and benefit summary letters from VA.gov so you know exactly what you have." },
  { id: "b2", pillar: "benefits", phase: 1, title: "Check your state's disabled-vet benefits", detail: "Property-tax exemptions, vehicle registration, hunting/fishing, tuition — these vary wildly by state." },
  { id: "e1", pillar: "education", phase: 1, title: "War-game GI Bill vs VR&E", detail: "Before you spend a single month of eligibility, compare the two in the Education war-gamer." },
  { id: "l1", pillar: "va-loan", phase: 1, title: "Get your Certificate of Eligibility (COE)", detail: "Request your VA loan COE — it proves your entitlement to lenders." },

  // Phase 2 (7–12): position
  { id: "l2", pillar: "va-loan", phase: 2, title: "Get pre-approved with a VA-savvy lender", detail: "Interview lenders who actually understand VA loans and the disabled-vet funding-fee exemption." },
  { id: "r1", pillar: "rentals", phase: 2, title: "Model a house-hack", detail: "Run duplex/triplex/quad numbers in the VA Loan planner: can rent cover most of the mortgage?" },
  { id: "biz1", pillar: "business", phase: 2, title: "Pick your home-service niche", detail: "Cleaning, pressure-washing, lawn — low startup, cash-flowing. Choose one you'll actually run." },
  { id: "b3", pillar: "benefits", phase: 2, title: "Enroll in VA health care", detail: "Confirm your priority group and set up your primary care — it's part of the comp you earned." },

  // Phase 3 (13–18): execute
  { id: "r2", pillar: "rentals", phase: 3, title: "Buy the house-hack (owner-occupy)", detail: "Use the VA loan to buy a 2–4 unit, live in one, rent the rest. Zero down, funding-fee exempt." },
  { id: "biz2", pillar: "business", phase: 3, title: "Land your first 5 paying customers", detail: "Register the business, get basic insurance, and get to 5 repeat customers." },
  { id: "e2", pillar: "education", phase: 3, title: "Start your chosen education path", detail: "Enroll using the benefit you war-gamed — degree, certificate, or apprenticeship." },

  // Phase 4 (19–24): compound
  { id: "r3", pillar: "rentals", phase: 4, title: "Stabilize and reserve", detail: "Build a maintenance reserve; get your rental to reliably cash-flow." },
  { id: "biz3", pillar: "business", phase: 4, title: "Systematize the business to ~$5k/mo", detail: "Repeatable jobs, scheduling, and a second set of hands so it doesn't depend only on you." },
  { id: "f1", pillar: "benefits", phase: 4, title: "Set your Freedom Number", detail: "Add up benefit + rental + business income and compare it to your monthly cost of living." },
];

export function missionsByPhase(phase: number): Mission[] {
  return ROADMAP.filter((m) => m.phase === phase);
}
