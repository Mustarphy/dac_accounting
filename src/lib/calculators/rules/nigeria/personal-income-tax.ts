import type { RuleSource } from "../types";
import { nairaToKobo, type Kobo } from "../../money";

export type PitBand = {
  /** Upper bound of this band, in Naira. null = no upper bound (top band). */
  upToNaira: number | null;
  rate: number;
};

/**
 * Personal income tax (PAYE) bands under the Nigeria Tax Act, 2025,
 * effective 1 January 2026. Replaces the pre-2026 PITA (as amended by the
 * Finance Act 2020) bands of 7%-24% with a ₦300,000 tax-free threshold.
 * See docs/calculators.md for the full source register and confirmation
 * status.
 */
export const NIGERIA_PIT_BANDS_2026: PitBand[] = [
  { upToNaira: 800_000, rate: 0 },
  { upToNaira: 3_000_000, rate: 0.15 },
  { upToNaira: 12_000_000, rate: 0.18 },
  { upToNaira: 25_000_000, rate: 0.21 },
  { upToNaira: 50_000_000, rate: 0.23 },
  { upToNaira: null, rate: 0.25 },
];

export const NIGERIA_PIT_RULE: RuleSource = {
  id: "ng-pit-bands-2026",
  name: "Nigeria personal income tax (PAYE) bands",
  jurisdiction: "Federal Republic of Nigeria",
  effectiveFrom: "2026-01-01",
  legalBasis: "Nigeria Tax Act, 2025 (personal income tax rate schedule)",
  sourceUrl:
    "https://www.mondaq.com/nigeria/capital-gains-tax/1726922/understanding-personal-income-tax-under-the-nigerian-tax-act-2025",
  additionalSources: [
    "https://kpmg.com/xx/en/our-insights/gms-flash-alert/flash-alert-2025-168.html",
    "https://www.ey.com/en_gl/technical/tax-alerts/nigeria-tax-act-2025-has-been-signed-highlights",
  ],
  verifiedOn: "2026-09-28",
  confidence: "verified",
  notes:
    "Bands corroborated across three independent professional sources (EY, KPMG, Mondaq). The official gazette text on nrs.gov.ng could not be retrieved directly (the site returned a bot-protection challenge to automated access) — recommend a final cross-check against the gazetted Act or a qualified Nigerian tax professional before this is relied on for filing purposes.",
};

export const NIGERIA_RENT_RELIEF_RULE: RuleSource & { rateOfRent: number; capKobo: Kobo } = {
  id: "ng-rent-relief-2026",
  name: "Rent relief (replaces the Consolidated Relief Allowance)",
  jurisdiction: "Federal Republic of Nigeria",
  rateOfRent: 0.2,
  capKobo: nairaToKobo(500_000),
  effectiveFrom: "2026-01-01",
  legalBasis: "Nigeria Tax Act, 2025, s.30(2)(a)(vi)",
  sourceUrl:
    "https://www.mondaq.com/nigeria/capital-gains-tax/1726922/understanding-personal-income-tax-under-the-nigerian-tax-act-2025",
  additionalSources: [
    "https://kpmg.com/xx/en/our-insights/gms-flash-alert/flash-alert-2025-168.html",
  ],
  verifiedOn: "2026-09-28",
  confidence: "verified",
  notes:
    "Deductible amount is the lower of 20% of annual rent paid or ₦500,000. Replaces the former Consolidated Relief Allowance entirely (this calculator does not apply both).",
};

export const NIGERIA_PENSION_RULE: RuleSource & { employeeRate: number; employerRate: number } = {
  id: "ng-pension-contributory-2014",
  name: "Contributory pension scheme minimum rates",
  jurisdiction: "Federal Republic of Nigeria",
  employeeRate: 0.08,
  employerRate: 0.1,
  effectiveFrom: "2014-07-01",
  legalBasis: "Pension Reform Act, 2014, s.4",
  sourceUrl:
    "https://www.mondaq.com/nigeria/retirement-superannuation-pensions/958354/reformations-can-the-pension-reform-act-2014-go-further",
  verifiedOn: "2026-09-28",
  confidence: "verified",
  notes:
    "Minimum contribution rates on Basic salary + Housing allowance + Transport allowance (BHT): 8% employee, 10% employer. The employee's 8% is deductible from taxable income under Nigeria Tax Act 2025 s.30(2)(a)(iii); the employer's 10% is a separate employer cost, never deducted from the employee's pay. Applies to employers with 3 or more employees in the formal private sector — self-employed individuals, very small employers, and informal-sector workers may not be covered, and this calculator does not attempt to determine eligibility.",
};
