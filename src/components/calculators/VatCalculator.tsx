"use client";

import { useState, type ChangeEvent, type FormEvent } from "react";
import { RotateCcw } from "lucide-react";
import Container from "@/components/ui/Container";
import ResultCard from "@/components/calculators/ResultCard";
import ResultRow from "@/components/calculators/ResultRow";
import SourceList from "@/components/calculators/SourceList";
import CalculatorDisclaimer from "@/components/calculators/CalculatorDisclaimer";
import { calculateVat, validateVatInput, type VatCalculatorResult, type VatDirection, type VatInputErrors } from "@/lib/calculators/vat";
import { formatNaira, formatPercent } from "@/lib/calculators/money";
import { NIGERIA_VAT_RULE } from "@/lib/calculators/rules/nigeria/vat";

type Fields = {
  amount: string;
  direction: VatDirection;
};

const initialFields: Fields = { amount: "", direction: "exclusive" };

export default function VatCalculator() {
  const [fields, setFields] = useState<Fields>(initialFields);
  const [errors, setErrors] = useState<VatInputErrors>({});
  const [result, setResult] = useState<VatCalculatorResult | null>(null);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const input = { amount: Number(fields.amount), direction: fields.direction };
    const validationErrors = validateVatInput(input);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) {
      setResult(null);
      return;
    }

    setResult(calculateVat(input));
  }

  function handleReset() {
    setFields(initialFields);
    setErrors({});
    setResult(null);
  }

  return (
    <section id="vat" className="scroll-mt-24 border-t border-slate-200 bg-primary-light py-16 lg:py-20">
      <Container>
        <div className="max-w-2xl">
          <h2 className="text-2xl font-bold tracking-tight text-ink sm:text-3xl">VAT Calculator</h2>
          <p className="mt-3 text-sm leading-relaxed text-muted">
            Add Nigeria&apos;s standard {formatPercent(NIGERIA_VAT_RULE.rate)} VAT to an amount, or work
            out how much VAT is already included in a price.
          </p>
        </div>

        <div className="mt-8 grid gap-8 lg:grid-cols-2 lg:gap-12">
          <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
            <div>
              <span className="mb-2 block text-sm font-medium text-ink">Does the amount already include VAT?</span>
              <div className="flex gap-3">
                <label className="flex flex-1 items-center gap-2 rounded-md border border-slate-300 bg-white px-4 py-3 text-sm text-ink has-[:checked]:border-primary has-[:checked]:bg-primary-light">
                  <input
                    type="radio"
                    name="direction"
                    value="exclusive"
                    checked={fields.direction === "exclusive"}
                    onChange={() => setFields((prev) => ({ ...prev, direction: "exclusive" }))}
                    className="text-primary focus:ring-primary"
                  />
                  No, add VAT
                </label>
                <label className="flex flex-1 items-center gap-2 rounded-md border border-slate-300 bg-white px-4 py-3 text-sm text-ink has-[:checked]:border-primary has-[:checked]:bg-primary-light">
                  <input
                    type="radio"
                    name="direction"
                    value="inclusive"
                    checked={fields.direction === "inclusive"}
                    onChange={() => setFields((prev) => ({ ...prev, direction: "inclusive" }))}
                    className="text-primary focus:ring-primary"
                  />
                  Yes, extract VAT
                </label>
              </div>
            </div>

            <div>
              <label htmlFor="vatAmount" className="mb-2 block text-sm font-medium text-ink">
                {fields.direction === "exclusive" ? "Amount before VAT (₦)" : "Amount including VAT (₦)"}
              </label>
              <input
                id="vatAmount"
                name="vatAmount"
                type="number"
                inputMode="decimal"
                min="0"
                step="any"
                value={fields.amount}
                onChange={(event: ChangeEvent<HTMLInputElement>) =>
                  setFields((prev) => ({ ...prev, amount: event.target.value }))
                }
                aria-invalid={Boolean(errors.amount)}
                aria-describedby={errors.amount ? "vatAmount-error" : undefined}
                className="w-full rounded-md border border-slate-300 px-4 py-3 text-sm text-ink outline-none transition-colors focus:border-primary"
              />
              {errors.amount && (
                <p id="vatAmount-error" className="mt-1.5 text-sm text-red-600">
                  {errors.amount}
                </p>
              )}
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                type="submit"
                className="inline-flex items-center justify-center gap-2 rounded-md bg-primary px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary-dark"
              >
                Calculate
              </button>
              <button
                type="button"
                onClick={handleReset}
                className="inline-flex items-center justify-center gap-2 rounded-md border border-slate-300 px-6 py-3 text-sm font-semibold text-ink transition-colors hover:border-primary hover:text-primary"
              >
                <RotateCcw className="size-4" aria-hidden="true" />
                Reset
              </button>
            </div>
          </form>

          <div>
            {result ? (
              <ResultCard>
                <ResultRow label="Amount before VAT" value={formatNaira(result.netAmountKobo)} />
                <ResultRow label={`VAT (${formatPercent(result.rate)})`} value={formatNaira(result.vatAmountKobo)} />
                <ResultRow label="Total including VAT" value={formatNaira(result.grossAmountKobo)} emphasis />
              </ResultCard>
            ) : (
              <div className="flex h-full min-h-[180px] items-center justify-center rounded-xl border border-dashed border-slate-300 bg-white p-6 text-center text-sm text-muted">
                Enter an amount and select Calculate to see the VAT breakdown.
              </div>
            )}

            <div className="mt-6 rounded-lg border border-slate-200 bg-white p-5 text-xs leading-relaxed text-muted">
              <h4 className="text-sm font-semibold text-ink">Assumptions</h4>
              <p className="mt-2">
                This calculator applies the standard rate to the whole amount entered. Not all goods
                and services are taxed identically under the Nigeria Tax Act 2025 — some categories
                (e.g. basic food, healthcare, education, certain baby products) are zero-rated or
                exempt. If your transaction falls into one of those categories, this calculator will
                overstate the VAT due — check with DAC. This tool does not determine VAT-refund or
                input-VAT-recovery eligibility.
              </p>
            </div>

            <SourceList sources={[NIGERIA_VAT_RULE]} />
            <CalculatorDisclaimer />
          </div>
        </div>
      </Container>
    </section>
  );
}
