import { nairaToKobo, type Kobo } from "./money";
import { NIGERIA_PROPERTY_STAMP_DUTY_RULE } from "./rules/nigeria/stamp-duty";

export type PropertyCalculatorInput = {
  transactionValue: number;
};

export type PropertyCalculatorResult = {
  transactionValueKobo: Kobo;
  isExempt: boolean;
  stampDutyKobo: Kobo;
  totalKobo: Kobo;
};

export function calculatePropertyStampDuty(input: PropertyCalculatorInput): PropertyCalculatorResult {
  const transactionValueKobo = nairaToKobo(Math.max(input.transactionValue, 0));
  const isExempt = transactionValueKobo < NIGERIA_PROPERTY_STAMP_DUTY_RULE.exemptionThresholdKobo;
  const stampDutyKobo = isExempt ? 0 : Math.round(transactionValueKobo * NIGERIA_PROPERTY_STAMP_DUTY_RULE.rate);

  return {
    transactionValueKobo,
    isExempt,
    stampDutyKobo,
    totalKobo: transactionValueKobo + stampDutyKobo,
  };
}

export type PropertyInputErrors = Partial<Record<"transactionValue", string>>;

export function validatePropertyInput(input: PropertyCalculatorInput): PropertyInputErrors {
  const errors: PropertyInputErrors = {};
  if (!Number.isFinite(input.transactionValue) || input.transactionValue <= 0) {
    errors.transactionValue = "Enter a transaction value greater than zero.";
  }
  return errors;
}
