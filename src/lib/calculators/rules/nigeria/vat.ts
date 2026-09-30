import type { RuleSource } from "../types";

/**
 * Nigeria standard VAT rate. Verified against the Nigeria Tax Act, 2025
 * (effective 1 January 2026), which repealed and consolidated the former
 * VAT Act. See docs/calculators.md for the full source register.
 */
export const NIGERIA_VAT_RULE: RuleSource & { rate: number } = {
  id: "ng-vat-standard-2026",
  name: "Nigeria standard VAT rate",
  jurisdiction: "Federal Republic of Nigeria",
  rate: 0.075,
  effectiveFrom: "2026-01-01",
  legalBasis: "Nigeria Tax Act, 2025 (repeals and consolidates the VAT Act)",
  sourceUrl: "https://www.ey.com/en_gl/technical/tax-alerts/nigeria-tax-act-2025-has-been-signed-highlights",
  additionalSources: [
    "https://businessday.ng/business-economy/article/nigerias-tax-reforms-set-lowest-vat-rate-among-african-peers/",
  ],
  verifiedOn: "2026-09-28",
  confidence: "verified",
  notes:
    "Standard rate unchanged from the pre-2026 VAT Act despite proposals during the reform process to raise it to 10-15%. Certain categories (basic food, healthcare, education, baby products, etc.) are zero-rated or exempt under the NTA 2025 and are NOT distinguished by this calculator — it assumes the standard rate applies to the amount entered. See docs/calculators.md for the exemption list this does not cover.",
};
