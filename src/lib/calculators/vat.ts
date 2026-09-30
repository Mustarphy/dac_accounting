import { nairaToKobo, type Kobo } from "./money";
import { NIGERIA_VAT_RULE } from "./rules/nigeria/vat";

export type VatDirection = "exclusive" | "inclusive";

export type VatCalculatorInput = {
  amount: number;
  direction: VatDirection;
};

export type VatCalculatorResult = {
  netAmountKobo: Kobo;
  vatAmountKobo: Kobo;
  grossAmountKobo: Kobo;
  rate: number;
};

export function calculateVat(input: VatCalculatorInput): VatCalculatorResult {
  const rate = NIGERIA_VAT_RULE.rate;
  const amountKobo = nairaToKobo(Math.max(input.amount, 0));

  if (input.direction === "exclusive") {
    const vatAmountKobo = Math.round(amountKobo * rate);
    return {
      netAmountKobo: amountKobo,
      vatAmountKobo,
      grossAmountKobo: amountKobo + vatAmountKobo,
      rate,
    };
  }

  const netAmountKobo = Math.round(amountKobo / (1 + rate));
  return {
    netAmountKobo,
    vatAmountKobo: amountKobo - netAmountKobo,
    grossAmountKobo: amountKobo,
    rate,
  };
}

export type VatInputErrors = Partial<Record<"amount", string>>;

export function validateVatInput(input: VatCalculatorInput): VatInputErrors {
  const errors: VatInputErrors = {};
  if (!Number.isFinite(input.amount) || input.amount <= 0) {
    errors.amount = "Enter an amount greater than zero.";
  }
  return errors;
}
