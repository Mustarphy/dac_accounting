import { nairaToKobo, type Kobo } from "./money";
import { NIGERIA_PENSION_RULE, NIGERIA_PIT_BANDS_2026, NIGERIA_RENT_RELIEF_RULE } from "./rules/nigeria/personal-income-tax";

export type PayFrequency = "annual" | "monthly";

export type PayeCalculatorInput = {
  /** Gross salary for one pay period, per `payFrequency`. */
  grossSalary: number;
  payFrequency: PayFrequency;
  /** Annual rent paid, in Naira. 0 if the visitor doesn't rent. */
  annualRentPaid: number;
  /** Whether to apply the 8% employee pension deduction. */
  includePension: boolean;
};

export type PayeBandBreakdown = {
  fromKobo: Kobo;
  toKobo: Kobo | null;
  rate: number;
  taxKobo: Kobo;
};

export type PayeCalculatorResult = {
  grossAnnualKobo: Kobo;
  pensionDeductionKobo: Kobo;
  employerPensionContributionKobo: Kobo;
  rentReliefKobo: Kobo;
  taxableIncomeKobo: Kobo;
  bands: PayeBandBreakdown[];
  annualTaxKobo: Kobo;
  annualNetKobo: Kobo;
  monthlyGrossKobo: Kobo;
  monthlyTaxKobo: Kobo;
  monthlyNetKobo: Kobo;
};

function toAnnualKobo(amount: number, frequency: PayFrequency): Kobo {
  const kobo = nairaToKobo(Math.max(amount, 0));
  return frequency === "monthly" ? kobo * 12 : kobo;
}

/**
 * Applies the progressive PAYE bands to taxable income. Each band's rate
 * applies only to the slice of income that falls within it — this is
 * standard graduated taxation, not a "whichever bracket you're in
 * applies to everything" cliff.
 */
function applyBands(taxableIncomeKobo: Kobo): { bands: PayeBandBreakdown[]; totalTaxKobo: Kobo } {
  const bands: PayeBandBreakdown[] = [];
  let totalTaxKobo = 0;
  let previousThresholdKobo = 0;

  for (const band of NIGERIA_PIT_BANDS_2026) {
    const upperBoundKobo = band.upToNaira === null ? null : nairaToKobo(band.upToNaira);
    const bandTopKobo = upperBoundKobo === null ? taxableIncomeKobo : Math.min(upperBoundKobo, taxableIncomeKobo);
    const incomeInBandKobo = Math.max(bandTopKobo - previousThresholdKobo, 0);

    if (incomeInBandKobo > 0) {
      const taxKobo = Math.round(incomeInBandKobo * band.rate);
      bands.push({ fromKobo: previousThresholdKobo, toKobo: upperBoundKobo, rate: band.rate, taxKobo });
      totalTaxKobo += taxKobo;
    }

    if (upperBoundKobo === null || taxableIncomeKobo <= upperBoundKobo) break;
    previousThresholdKobo = upperBoundKobo;
  }

  return { bands, totalTaxKobo };
}

export function calculatePaye(input: PayeCalculatorInput): PayeCalculatorResult {
  const grossAnnualKobo = toAnnualKobo(input.grossSalary, input.payFrequency);

  const pensionDeductionKobo = input.includePension
    ? Math.round(grossAnnualKobo * NIGERIA_PENSION_RULE.employeeRate)
    : 0;
  const employerPensionContributionKobo = input.includePension
    ? Math.round(grossAnnualKobo * NIGERIA_PENSION_RULE.employerRate)
    : 0;

  const annualRentKobo = nairaToKobo(Math.max(input.annualRentPaid, 0));
  const rentReliefKobo = Math.min(
    Math.round(annualRentKobo * NIGERIA_RENT_RELIEF_RULE.rateOfRent),
    NIGERIA_RENT_RELIEF_RULE.capKobo
  );

  const taxableIncomeKobo = Math.max(grossAnnualKobo - pensionDeductionKobo - rentReliefKobo, 0);

  const { bands, totalTaxKobo } = applyBands(taxableIncomeKobo);
  const annualNetKobo = grossAnnualKobo - pensionDeductionKobo - totalTaxKobo;

  return {
    grossAnnualKobo,
    pensionDeductionKobo,
    employerPensionContributionKobo,
    rentReliefKobo,
    taxableIncomeKobo,
    bands,
    annualTaxKobo: totalTaxKobo,
    annualNetKobo,
    monthlyGrossKobo: Math.round(grossAnnualKobo / 12),
    monthlyTaxKobo: Math.round(totalTaxKobo / 12),
    monthlyNetKobo: Math.round(annualNetKobo / 12),
  };
}

export type PayeInputErrors = Partial<Record<"grossSalary" | "annualRentPaid", string>>;

export function validatePayeInput(input: PayeCalculatorInput): PayeInputErrors {
  const errors: PayeInputErrors = {};
  if (!Number.isFinite(input.grossSalary) || input.grossSalary <= 0) {
    errors.grossSalary = "Enter a gross salary greater than zero.";
  }
  if (!Number.isFinite(input.annualRentPaid) || input.annualRentPaid < 0) {
    errors.annualRentPaid = "Enter 0 if you don't pay rent, or a positive amount.";
  }
  return errors;
}
