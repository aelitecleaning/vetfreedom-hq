// The Vault — premium content unlocked by the one-time Playbook purchase.
//
// COMPLIANCE: every item here is on the FINANCIAL-FREEDOM side (VA-loan deals,
// the home-service business, budgeting to a freedom number). There are
// deliberately NO claim documents — no personal-statement templates, no form
// fill-ins, nothing that could be construed as preparing a VA claim. That line
// is what keeps this legal to sell.

export interface VaultLine {
  /** A prompt/label; `fill` renders a blank line, `check` renders a checkbox. */
  label: string;
  kind: "fill" | "check" | "note";
}

export interface VaultItem {
  slug: string;
  title: string;
  summary: string;
  pillar: "va-loan" | "rentals" | "business" | "benefits";
  lines: VaultLine[];
}

export const VAULT: VaultItem[] = [
  {
    slug: "house-hack-deal-analyzer",
    title: "House-Hack Deal Analyzer",
    summary:
      "Run any 2–4 unit through the same napkin math before you tour it. If the rent doesn't cover most of the note, walk.",
    pillar: "va-loan",
    lines: [
      { label: "Property address", kind: "fill" },
      { label: "Purchase price", kind: "fill" },
      { label: "Units (you live in 1)", kind: "fill" },
      { label: "Estimated rent per rented unit", kind: "fill" },
      { label: "Estimated monthly P&I (use the free planner)", kind: "fill" },
      { label: "Taxes + insurance + reserve (monthly)", kind: "fill" },
      { label: "Rent income − total housing = your real cost", kind: "fill" },
      { label: "Confirmed $0-down VA loan eligibility (COE in hand)", kind: "check" },
      { label: "Confirmed funding-fee exemption with lender", kind: "check" },
      { label: "Toured in person / inspection ordered", kind: "check" },
      { label: "Rule of thumb: rent should cover 80%+ of housing before you buy", kind: "note" },
    ],
  },
  {
    slug: "va-lender-interview-script",
    title: "VA Lender Interview Script",
    summary:
      "Most loan officers rarely do VA loans. These are the questions that separate the pros from the rest — copy them into your calls.",
    pillar: "va-loan",
    lines: [
      { label: "How many VA loans did you personally close last year?", kind: "check" },
      { label: "Do you confirm my funding-fee exemption from my award letter?", kind: "check" },
      { label: "Are you comfortable with a 2–4 unit owner-occupied VA purchase?", kind: "check" },
      { label: "Will you count projected rental income toward my qualification?", kind: "check" },
      { label: "What's your lender credit / are you covering any closing costs?", kind: "check" },
      { label: "Can you give me a written loan estimate today?", kind: "check" },
      { label: "Note: get loan estimates from 2–3 lenders and compare side by side", kind: "note" },
    ],
  },
  {
    slug: "freedom-number-worksheet",
    title: "Your Freedom Number Worksheet",
    summary:
      "The one number that matters: what does it cost you to live each month? Beat it with income and you're free.",
    pillar: "benefits",
    lines: [
      { label: "Housing (rent/mortgage after house-hack)", kind: "fill" },
      { label: "Utilities + phone + internet", kind: "fill" },
      { label: "Food", kind: "fill" },
      { label: "Transportation", kind: "fill" },
      { label: "Insurance + healthcare (after VA)", kind: "fill" },
      { label: "Debt payments", kind: "fill" },
      { label: "Everything else", kind: "fill" },
      { label: "= YOUR FREEDOM NUMBER (monthly)", kind: "fill" },
      { label: "Now: VA comp + rental + business income vs that number", kind: "note" },
      { label: "Track the gap in the free Income Trackers each month", kind: "note" },
    ],
  },
  {
    slug: "home-service-business-launch-kit",
    title: "Home-Service Business Launch Kit",
    summary:
      "The 30-day checklist to go from idea to first paying customer in a cash-flowing home-service niche.",
    pillar: "business",
    lines: [
      { label: "Pick one niche (cleaning, pressure-washing, lawn, junk haul)", kind: "check" },
      { label: "Name + register the business (LLC or sole prop to start)", kind: "check" },
      { label: "Basic general-liability insurance quote", kind: "check" },
      { label: "One-page price list for 3 core services", kind: "check" },
      { label: "Free Google Business Profile live", kind: "check" },
      { label: "Before/after photos from 2 free/discounted first jobs", kind: "check" },
      { label: "Ask every customer for a review + a referral", kind: "check" },
      { label: "Goal: 5 repeat customers before you spend a dollar on ads", kind: "note" },
      { label: "Veteran-owned (SDVOSB) status is a marketing asset — use it", kind: "note" },
    ],
  },
  {
    slug: "tenant-screening-checklist",
    title: "Tenant Screening Checklist",
    summary:
      "Your rented units pay your mortgage — screen like it. A bad tenant costs more than a vacant month.",
    pillar: "rentals",
    lines: [
      { label: "Income ≥ 3x rent, verified (pay stubs / offer letter)", kind: "check" },
      { label: "Credit + background check (with written consent)", kind: "check" },
      { label: "Prior landlord reference (not the current one — they may want them gone)", kind: "check" },
      { label: "Consistent, written screening criteria for every applicant (fair housing)", kind: "check" },
      { label: "Security deposit + first month before keys", kind: "check" },
      { label: "Written lease, signed, everyone on it", kind: "check" },
      { label: "Note: apply the SAME criteria to everyone — it's the law and it protects you", kind: "note" },
    ],
  },
];

export function vaultItemBySlug(slug: string): VaultItem | undefined {
  return VAULT.find((v) => v.slug === slug);
}
