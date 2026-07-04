// VA "combined ratings" math (38 CFR § 4.25 and § 4.26).
//
// This is NOT simple addition. The VA combines disabilities using the idea that
// each successive disability applies only to the "remaining efficiency" of the
// body. Two 50% ratings combine to 75%, not 100%.
//
// This module is pure math with no predictions — it shows how the VA arithmetic
// works. It never estimates what rating a condition "should" get.

export interface Disability {
  /** Whole-number VA rating 0–100 (must be a valid 10-step, e.g. 10,20,30…). */
  percent: number;
  /**
   * Bilateral = affects paired extremities (both arms, both legs, or paired
   * skeletal muscles). Bilateral disabilities get an extra 10% "bilateral
   * factor" per § 4.26. Set the SAME group label on limbs that pair together.
   * Leave undefined for non-bilateral conditions.
   */
  bilateralGroup?: string;
}

/** Combine two ratings (0–100) using the VA formula. Returns a 0–100 number. */
export function combineTwo(a: number, b: number): number {
  // Combined = a + b*(100-a)/100, using the higher as the running total.
  const high = Math.max(a, b);
  const low = Math.min(a, b);
  return high + (low * (100 - high)) / 100;
}

/** Combine a list of ratings (unrounded running value), highest-first. */
function combineList(percents: number[]): number {
  const sorted = [...percents].sort((x, y) => y - x);
  return sorted.reduce((running, p) => combineTwo(running, p), 0);
}

/** Round a combined value to the nearest 10 (VA final-step rounding, § 4.25). */
export function roundToNearestTen(value: number): number {
  return Math.round(value / 10) * 10;
}

export interface CombinedResult {
  /** Final VA rating, rounded to the nearest 10 (this is the payable rating). */
  rounded: number;
  /** The exact combined value before final rounding (e.g. 73.5). */
  exact: number;
  /** Human-readable steps, so the UI can show the VA's own arithmetic. */
  steps: string[];
}

/**
 * Compute a combined VA rating from individual disabilities, applying the
 * bilateral factor to any groups the caller has tagged.
 *
 * Order per § 4.26: combine the bilateral disabilities within each group first,
 * add the 10% bilateral factor to that group's combined value, THEN combine the
 * groups and the non-bilateral disabilities together, highest-first.
 */
export function computeCombinedRating(
  disabilities: Disability[]
): CombinedResult {
  const steps: string[] = [];
  const nonBilateral: number[] = [];
  const groups = new Map<string, number[]>();

  for (const d of disabilities) {
    if (d.percent <= 0) continue;
    if (d.bilateralGroup) {
      const arr = groups.get(d.bilateralGroup) ?? [];
      arr.push(d.percent);
      groups.set(d.bilateralGroup, arr);
    } else {
      nonBilateral.push(d.percent);
    }
  }

  // Each bilateral group: combine within, add 10% bilateral factor.
  const groupValues: number[] = [];
  for (const [label, percents] of groups) {
    if (percents.length === 1) {
      // A lone limb in a group isn't actually bilateral — treat as non-bilateral.
      nonBilateral.push(percents[0]);
      steps.push(
        `Group "${label}" had only one disability (${percents[0]}%), so no bilateral factor applies.`
      );
      continue;
    }
    const combined = combineList(percents);
    const withFactor = combined + combined * 0.1;
    groupValues.push(withFactor);
    steps.push(
      `Bilateral group "${label}": combine ${percents
        .slice()
        .sort((a, b) => b - a)
        .join("% + ")}% = ${combined.toFixed(
        1
      )}%, then +10% bilateral factor = ${withFactor.toFixed(1)}%.`
    );
  }

  const allValues = [...nonBilateral, ...groupValues].sort((a, b) => b - a);
  if (allValues.length === 0) {
    return { rounded: 0, exact: 0, steps: ["No ratable disabilities entered."] };
  }

  let running = 0;
  for (const v of allValues) {
    const before = running;
    running = combineTwo(running, v);
    steps.push(
      `Combine ${before.toFixed(1)}% with ${v.toFixed(
        1
      )}% → ${running.toFixed(1)}%.`
    );
  }

  const rounded = roundToNearestTen(running);
  steps.push(
    `Final combined value ${running.toFixed(
      1
    )}% rounds to the nearest 10 → ${rounded}%.`
  );

  return { rounded, exact: running, steps };
}
