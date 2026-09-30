/**
 * Every legal/tax rule the calculators rely on is recorded in this shape
 * so it can be displayed to the visitor and audited later. Do not add a
 * rule without filling in `sourceUrl` and `verifiedOn` — see
 * docs/calculators.md for the process for updating these.
 */
export type RuleConfidence = "verified" | "provisional";

export type RuleSource = {
  id: string;
  name: string;
  jurisdiction: string;
  legalBasis: string;
  effectiveFrom: string;
  sourceUrl: string;
  additionalSources?: string[];
  verifiedOn: string;
  confidence: RuleConfidence;
  notes: string;
};
