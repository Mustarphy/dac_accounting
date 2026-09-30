import type { RuleSource } from "../types";
import { nairaToKobo, type Kobo } from "../../money";

/**
 * Federal stamp duty on the transfer (conveyance/deed of assignment) of
 * real property — land and buildings only. This is deliberately narrow:
 * it does NOT cover leases, mortgages, or mineral-asset transfers (each
 * taxed under a different schedule), and it does NOT cover state
 * governor's consent fees, registration fees, or legal/professional
 * fees, which are separate, often state-specific charges that can
 * exceed the stamp duty itself.
 *
 * Confidence is marked "provisional": only one clear secondary source
 * for the exact 1.5% ad valorem rate was found during research, and the
 * Ninth Schedule of the Act (the primary text) could not be retrieved
 * directly. Treat this figure as needing confirmation from a qualified
 * Nigerian property/tax professional before relying on it for a real
 * transaction — see docs/calculators.md.
 */
export const NIGERIA_PROPERTY_STAMP_DUTY_RULE: RuleSource & { rate: number; exemptionThresholdKobo: Kobo } = {
  id: "ng-stamp-duty-property-transfer-2026",
  name: "Stamp duty on real property transfer (conveyance)",
  jurisdiction: "Federal Republic of Nigeria",
  rate: 0.015,
  exemptionThresholdKobo: nairaToKobo(10_000_000),
  effectiveFrom: "2026-01-01",
  legalBasis: "Nigeria Tax Act, 2025, Ninth Schedule — 'conveyance on sale' of real property (s.201)",
  sourceUrl: "https://businessday.ng/opinion/article/the-nigeria-tax-act-2025-a-breath-of-fresh-air-for-stamp-duty-tax/",
  verifiedOn: "2026-09-28",
  confidence: "provisional",
  notes:
    "Property transfers valued below ₦10,000,000 are exempt. Above that threshold, the ad valorem rate applies to the full transaction value. This covers ONLY the federal stamp duty on the transfer instrument — it excludes governor's consent fees, registration fees, legal fees, agency fees, Capital Gains Tax, and any other transaction costs. It also excludes leases, mortgages, and mineral-asset transfers, which have their own rate schedules under the Act and are not implemented here.",
};
