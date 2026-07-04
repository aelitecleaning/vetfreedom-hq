// Monthly compensation lookup from the seeded 2026 rate tables. Pure data
// lookup — this reports the published VA amount for a rating + dependent
// situation. It does not predict eligibility or outcomes.

import rates from "./rates-2026.json";

export type PayableRating = 10 | 20 | 30 | 40 | 50 | 60 | 70 | 80 | 90 | 100;

export interface Dependents {
  spouse: boolean;
  childrenUnder18: number;
  childrenInSchool: number; // over 18, in approved school
  parents: number; // 0, 1, or 2
  spouseAidAndAttendance: boolean;
}

export const NO_DEPENDENTS: Dependents = {
  spouse: false,
  childrenUnder18: 0,
  childrenInSchool: 0,
  parents: 0,
  spouseAidAndAttendance: false,
};

const alone = rates.veteranAlone as Record<string, number>;
const spouseNoKids = rates.withSpouseNoChildren as Record<string, number>;
const spouseOneKid = rates.withSpouseOneChild as Record<string, number>;
const deltas = rates.dependentDeltas;

export interface CompResult {
  monthly: number;
  annual: number;
  ratesEffective: string;
  ratesVersion: string;
  disclaimer: string;
  breakdown: string[];
}

const VERIFY =
  "Seeded estimate — verify the exact amount on VA.gov before relying on it.";

/**
 * Look up estimated monthly compensation. Dependents only affect ratings 30%+.
 * Delta add-ons are prorated by rating (ratingFactor = pct/100), mirroring how
 * the VA tables scale dependent amounts down at lower ratings.
 */
export function lookupCompensation(
  ratingPct: number,
  dependents: Dependents = NO_DEPENDENTS
): CompResult {
  const key = String(ratingPct);
  const breakdown: string[] = [];

  if (ratingPct < 10 || !alone[key]) {
    return {
      monthly: 0,
      annual: 0,
      ratesEffective: rates._meta.effectiveDate,
      ratesVersion: rates._meta.version,
      disclaimer: VERIFY,
      breakdown: ["A rating below 10% pays $0 in monthly compensation."],
    };
  }

  // Below 30%, dependents don't change the amount.
  if (ratingPct < 30) {
    const monthly = alone[key];
    breakdown.push(`Base rate at ${ratingPct}% (no dependent add-ons below 30%): $${monthly.toFixed(2)}.`);
    return finalize(monthly, breakdown);
  }

  const ratingFactor = ratingPct / 100;
  let monthly: number;

  if (!dependents.spouse && dependents.childrenUnder18 === 0 && dependents.childrenInSchool === 0) {
    monthly = alone[key];
    breakdown.push(`Veteran alone at ${ratingPct}%: $${monthly.toFixed(2)}.`);
  } else if (dependents.spouse && dependents.childrenUnder18 === 0 && dependents.childrenInSchool === 0) {
    monthly = spouseNoKids[key];
    breakdown.push(`Veteran + spouse at ${ratingPct}%: $${monthly.toFixed(2)}.`);
  } else if (dependents.spouse && dependents.childrenUnder18 + dependents.childrenInSchool >= 1) {
    monthly = spouseOneKid[key];
    breakdown.push(`Veteran + spouse + 1 child at ${ratingPct}%: $${monthly.toFixed(2)}.`);
  } else {
    // No spouse but has children: approximate from alone + child deltas.
    monthly = alone[key];
    breakdown.push(`Veteran + child(ren), no spouse — starting from alone base at ${ratingPct}%: $${monthly.toFixed(2)}.`);
  }

  // Additional children beyond the one already included in the "one child" base.
  const oneChildAlreadyCounted = dependents.spouse ? 1 : 0;
  const extraUnder18 = Math.max(0, dependents.childrenUnder18 - oneChildAlreadyCounted);
  if (extraUnder18 > 0) {
    const add = deltas.additionalChildUnder18At100 * ratingFactor * extraUnder18;
    monthly += add;
    breakdown.push(`+ ${extraUnder18} additional child(ren) under 18: +$${add.toFixed(2)}.`);
  }
  if (dependents.childrenInSchool > 0) {
    const add = deltas.additionalChildOver18SchoolAt100 * ratingFactor * dependents.childrenInSchool;
    monthly += add;
    breakdown.push(`+ ${dependents.childrenInSchool} child(ren) 18+ in school: +$${add.toFixed(2)}.`);
  }
  if (dependents.parents > 0) {
    const add = deltas.eachParentAt100 * ratingFactor * dependents.parents;
    monthly += add;
    breakdown.push(`+ ${dependents.parents} dependent parent(s): +$${add.toFixed(2)}.`);
  }
  if (dependents.spouseAidAndAttendance) {
    const add = deltas.spouseAdditionalForAidAndAttendanceAt100 * ratingFactor;
    monthly += add;
    breakdown.push(`+ spouse Aid & Attendance: +$${add.toFixed(2)}.`);
  }

  return finalize(monthly, breakdown);
}

function finalize(monthly: number, breakdown: string[]): CompResult {
  const rounded = Math.round(monthly * 100) / 100;
  return {
    monthly: rounded,
    annual: Math.round(rounded * 12 * 100) / 100,
    ratesEffective: rates._meta.effectiveDate,
    ratesVersion: rates._meta.version,
    disclaimer: VERIFY,
    breakdown,
  };
}
