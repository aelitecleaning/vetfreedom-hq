// Finance math for the Command Center. General educational modeling only — not
// individualized financial, tax, or lending advice. All rates are user inputs.

/** Standard amortized monthly principal + interest payment. */
export function monthlyPI(
  principal: number,
  annualRatePct: number,
  years: number
): number {
  const n = years * 12;
  const r = annualRatePct / 100 / 12;
  if (principal <= 0 || n <= 0) return 0;
  if (r === 0) return principal / n;
  const payment = (principal * r) / (1 - Math.pow(1 + r, -n));
  return Math.round(payment * 100) / 100;
}

export interface HouseHackInput {
  price: number;
  ratePct: number;
  years: number;
  units: number; // total units (you live in 1)
  rentPerUnit: number; // monthly rent per rented unit
  taxesInsMonthly: number; // property tax + insurance + est. maintenance
}

export interface HouseHackResult {
  loanAmount: number;
  piMonthly: number;
  totalHousingMonthly: number;
  rentedUnits: number;
  rentIncome: number;
  netOutOfPocket: number; // what YOU pay after rent (negative = cash flow)
  coversPct: number; // % of housing covered by rent
}

// VA loans allow $0 down. Disabled vets receiving compensation are typically
// exempt from the funding fee, so we model the loan at the full price.
export function analyzeHouseHack(i: HouseHackInput): HouseHackResult {
  const loanAmount = i.price; // $0 down on a VA loan
  const piMonthly = monthlyPI(loanAmount, i.ratePct, i.years);
  const totalHousingMonthly = piMonthly + i.taxesInsMonthly;
  const rentedUnits = Math.max(0, i.units - 1);
  const rentIncome = rentedUnits * i.rentPerUnit;
  const netOutOfPocket = Math.round((totalHousingMonthly - rentIncome) * 100) / 100;
  const coversPct =
    totalHousingMonthly > 0
      ? Math.round((rentIncome / totalHousingMonthly) * 100)
      : 0;
  return {
    loanAmount,
    piMonthly,
    totalHousingMonthly,
    rentedUnits,
    rentIncome,
    netOutOfPocket,
    coversPct,
  };
}

// GI Bill (Post-9/11, Ch.33) vs VR&E (Ch.31) — general comparison scaffold. The
// numbers below are user-editable inputs; we don't hardcode benefit amounts
// because they change yearly and depend on the individual. Verify on VA.gov.
export interface EduInput {
  months: number;
  monthlyHousing: number; // MHA / subsistence allowance estimate
  tuitionPerYear: number;
  booksPerYear: number;
}

export interface EduResult {
  totalHousing: number;
  totalTuition: number;
  totalBooks: number;
  grandTotal: number;
}

export function totalEducationValue(i: EduInput): EduResult {
  const years = i.months / 12;
  const totalHousing = Math.round(i.monthlyHousing * i.months);
  const totalTuition = Math.round(i.tuitionPerYear * years);
  const totalBooks = Math.round(i.booksPerYear * years);
  return {
    totalHousing,
    totalTuition,
    totalBooks,
    grandTotal: totalHousing + totalTuition + totalBooks,
  };
}
