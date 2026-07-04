import { describe, expect, it } from "vitest";
import {
  combineTwo,
  computeCombinedRating,
  roundToNearestTen,
} from "./combined-ratings";

describe("combineTwo", () => {
  it("combines two 50s to 75 (the classic VA example)", () => {
    expect(combineTwo(50, 50)).toBe(75);
  });
  it("is order-independent", () => {
    expect(combineTwo(30, 40)).toBeCloseTo(combineTwo(40, 30));
  });
  it("30 and 20 combine to 44", () => {
    expect(combineTwo(30, 20)).toBe(44);
  });
});

describe("roundToNearestTen", () => {
  it("rounds 73.5 to 70", () => expect(roundToNearestTen(73.5)).toBe(70));
  it("rounds 75 up to 80", () => expect(roundToNearestTen(75)).toBe(80));
  it("rounds 84 down to 80", () => expect(roundToNearestTen(84)).toBe(80));
});

describe("computeCombinedRating", () => {
  it("40 + 30 + 20 + 10 combine to 70 (VA worked example)", () => {
    // 40 & 30 -> 58; 58 & 20 -> 66.4; 66.4 & 10 -> 69.76 -> rounds to 70
    const r = computeCombinedRating([
      { percent: 40 },
      { percent: 30 },
      { percent: 20 },
      { percent: 10 },
    ]);
    expect(r.rounded).toBe(70);
    expect(r.exact).toBeCloseTo(69.76, 1);
  });

  it("a single disability passes through", () => {
    expect(computeCombinedRating([{ percent: 50 }]).rounded).toBe(50);
  });

  it("empty input yields 0", () => {
    expect(computeCombinedRating([]).rounded).toBe(0);
  });

  it("applies the 10% bilateral factor to a paired group", () => {
    // Two legs at 20% each: combine 20 & 20 = 36; +10% factor = 39.6.
    const withBilateral = computeCombinedRating([
      { percent: 20, bilateralGroup: "legs" },
      { percent: 20, bilateralGroup: "legs" },
    ]);
    // 39.6 rounds to 40.
    expect(withBilateral.rounded).toBe(40);
    expect(withBilateral.exact).toBeCloseTo(39.6, 1);

    // Without the bilateral tag the same two combine to just 36 -> 40 rounded,
    // but the exact value is lower, proving the factor was applied above.
    const withoutBilateral = computeCombinedRating([
      { percent: 20 },
      { percent: 20 },
    ]);
    expect(withoutBilateral.exact).toBeCloseTo(36, 1);
    expect(withBilateral.exact).toBeGreaterThan(withoutBilateral.exact);
  });

  it("treats a lone limb in a group as non-bilateral (no factor)", () => {
    const r = computeCombinedRating([{ percent: 30, bilateralGroup: "arms" }]);
    expect(r.rounded).toBe(30);
    expect(r.exact).toBe(30);
  });
});
