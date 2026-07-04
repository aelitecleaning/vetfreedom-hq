// Federal benefits catalog used to build the Day-0 "Benefits Left on the Table"
// briefing. Each item has a plain-English explainer and an eligibility HINT
// function — hints only surface the benefit for education, they never determine
// or promise eligibility. Every item links to an official source.

export type SeparationStatus = "active" | "transitioning" | "out";

export interface VetProfile {
  branch?: string;
  status: SeparationStatus;
  ratingPct: number | null; // null = not yet rated
  hasSpouse: boolean;
  goals: string[]; // e.g. ["rating", "house", "school", "business"]
}

export interface Benefit {
  key: string;
  name: string;
  blurb: string;
  /** Returns true if this benefit is worth surfacing to this veteran. */
  surface: (p: VetProfile) => boolean;
  /** Short note on why it's surfaced / what to check. */
  note: (p: VetProfile) => string;
  source: string;
  pillar?: "va-loan" | "education" | "benefits" | "business" | "rentals";
}

const rated = (p: VetProfile) => (p.ratingPct ?? 0) > 0;
const highRating = (p: VetProfile) => (p.ratingPct ?? 0) >= 30;

export const BENEFITS: Benefit[] = [
  {
    key: "va-home-loan",
    name: "VA Home Loan Entitlement",
    blurb:
      "A VA-guaranteed mortgage with no down payment and no PMI. The foundation of the MTFF house-hacking pillar.",
    surface: () => true,
    note: (p) =>
      p.goals.includes("house")
        ? "You flagged buying a house — this is your primary tool. Learn entitlement and house-hacking in the Command Center."
        : "Even if you're not buying now, know your entitlement. It's one of the strongest benefits you earned.",
    source: "https://www.va.gov/housing-assistance/home-loans/",
    pillar: "va-loan",
  },
  {
    key: "funding-fee-exemption",
    name: "VA Loan Funding-Fee Exemption",
    blurb:
      "Veterans receiving compensation for a service-connected disability are typically exempt from the VA loan funding fee — often thousands of dollars saved.",
    surface: (p) => rated(p),
    note: () =>
      "Because you receive disability compensation, you're generally exempt from the funding fee. Confirm on VA.gov / with your lender.",
    source: "https://www.va.gov/housing-assistance/home-loans/funding-fee-and-closing-costs/",
    pillar: "va-loan",
  },
  {
    key: "post-911-gi-bill",
    name: "Post-9/11 GI Bill (Chapter 33)",
    blurb: "Tuition, a monthly housing allowance, and a books stipend for school or training.",
    surface: () => true,
    note: (p) =>
      p.goals.includes("school")
        ? "You flagged school — compare this against VR&E in the Education war-gamer before you burn a single month."
        : "Even if school isn't the plan, you may be able to transfer these benefits to a spouse or child.",
    source: "https://www.va.gov/education/about-gi-bill-benefits/post-9-11/",
    pillar: "education",
  },
  {
    key: "vre-chapter-31",
    name: "Veteran Readiness & Employment (VR&E, Chapter 31)",
    blurb:
      "Career training and education for veterans with a service-connected disability — often MORE generous than the GI Bill, and it doesn't burn your GI Bill months.",
    surface: (p) => rated(p),
    note: () =>
      "With a service-connected rating you may qualify for VR&E. Many veterans overlook it. Compare it to the GI Bill in the Command Center.",
    source: "https://www.va.gov/careers-employment/vocational-rehabilitation/",
    pillar: "education",
  },
  {
    key: "property-tax-exemption",
    name: "State Property-Tax Exemption",
    blurb:
      "Many states waive part or all of property taxes for disabled veterans — sometimes 100% at higher ratings. Rules vary by state.",
    surface: (p) => highRating(p),
    note: () =>
      "At your rating, your state may offer a partial or full property-tax exemption. Check your state veterans affairs office — this varies a lot by state.",
    source: "https://www.va.gov/resources/veterans-property-tax-exemptions-by-state/",
    pillar: "benefits",
  },
  {
    key: "champva-healthcare",
    name: "Health Care & CHAMPVA (dependents)",
    blurb:
      "VA health care for you, and for permanently & totally disabled veterans, CHAMPVA coverage for eligible family members.",
    surface: (p) => rated(p),
    note: (p) =>
      p.ratingPct === 100
        ? "At a P&T 100% rating, your dependents may qualify for CHAMPVA. Confirm eligibility on VA.gov."
        : "Make sure you're enrolled in VA health care — your rating affects your priority group and costs.",
    source: "https://www.va.gov/health-care/family-caregiver-benefits/champva/",
    pillar: "benefits",
  },
  {
    key: "sah-sha-grants",
    name: "Adapted Housing Grants (SAH / SHA)",
    blurb:
      "Grants to buy or modify a home for a qualifying service-connected disability (mobility, vision, and more).",
    surface: (p) => highRating(p),
    note: () =>
      "Depending on your specific service-connected conditions, you may qualify for an adapted-housing grant. Eligibility is condition-specific — check VA.gov.",
    source: "https://www.va.gov/housing-assistance/disability-housing-grants/",
    pillar: "va-loan",
  },
  {
    key: "commissary-exchange",
    name: "Commissary, Exchange & MWR Access",
    blurb:
      "Service-connected disabled veterans have lifetime access to commissary, exchange, and MWR facilities (in person and online).",
    surface: (p) => rated(p),
    note: () =>
      "Your service-connected rating grants commissary/exchange/MWR access — including online via the Veterans Online Shopping Benefit.",
    source: "https://www.va.gov/records/download-va-letters/",
    pillar: "benefits",
  },
  {
    key: "small-business",
    name: "Veteran-Owned Small Business (VOSB) & SDVOSB",
    blurb:
      "Certification opens set-aside federal contracts. The MTFF home-service business pillar starts here.",
    surface: (p) => p.goals.includes("business") || rated(p),
    note: (p) =>
      p.goals.includes("business")
        ? "You flagged building a business — service-disabled veteran certification (SDVOSB) can open contract set-asides. Start in the Business Launch missions."
        : "If you ever start a business, your veteran status is an asset. Keep it in your back pocket.",
    source: "https://www.va.gov/osdbu/",
    pillar: "business",
  },
];

export function surfaceBenefits(p: VetProfile): Benefit[] {
  return BENEFITS.filter((b) => b.surface(p));
}
