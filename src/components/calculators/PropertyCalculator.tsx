"use client";

import { useState, type ChangeEvent, type FormEvent } from "react";
import { AlertTriangle, RotateCcw } from "lucide-react";
import Container from "@/components/ui/Container";
import ResultCard from "@/components/calculators/ResultCard";
import ResultRow from "@/components/calculators/ResultRow";
import SourceList from "@/components/calculators/SourceList";
import CalculatorDisclaimer from "@/components/calculators/CalculatorDisclaimer";
import {
  calculatePropertyStampDuty,
  validatePropertyInput,
  type PropertyCalculatorResult,
  type PropertyInputErrors,
} from "@/lib/calculators/property";
import { formatNaira } from "@/lib/calculators/money";
import { NIGERIA_PROPERTY_STAMP_DUTY_RULE } from "@/lib/calculators/rules/nigeria/stamp-duty";

export default function PropertyCalculator() {
  const [transactionValue, setTransactionValue] = useState("");
  const [errors, setErrors] = useState<PropertyInputErrors>({});
  const [result, setResult] = useState<PropertyCalculatorResult | null>(null);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const input = { transactionValue: Number(transactionValue) };
    const validationErrors = validatePropertyInput(input);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) {
      setResult(null);
      return;
    }

    setResult(calculatePropertyStampDuty(input));
  }

  function handleReset() {
    setTransactionValue("");
    setErrors({});
    setResult(null);
  }

  return (
    <section id="property" className="scroll-mt-24 border-t border-slate-200 py-16 lg:py-20">
      <Container>
        <div className="max-w-2xl">
          <h2 className="text-2xl font-bold tracking-tight text-ink sm:text-3xl">Property Calculator</h2>
          <p className="mt-3 text-sm leading-relaxed text-muted">
            Estimate the federal stamp duty payable on transferring (conveying) land or a building
            in Nigeria.
          </p>
        </div>

        <div className="mt-6 flex max-w-2xl items-start gap-3 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
          <AlertTriangle className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
          <p>
            <strong>Limited scope.</strong> This covers only the federal ad valorem stamp duty on a
            property transfer instrument. It does <strong>not</strong> include state governor&apos;s
            consent fees, registration fees, legal/agency fees, or Capital Gains Tax — these are
            separate charges, often set by the state, that can add significantly more to the total
            cost. It also doesn&apos;t cover leases, mortgages, or mineral-asset transfers. See the
            sources below.
          </p>
        </div>

        <div className="mt-8 grid gap-8 lg:grid-cols-2 lg:gap-12">
          <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
            <div>
              <label htmlFor="transactionValue" className="mb-2 block text-sm font-medium text-ink">
                Property transaction value (₦)
              </label>
              <input
                id="transactionValue"
                name="transactionValue"
                type="number"
                inputMode="decimal"
                min="0"
                step="any"
                value={transactionValue}
                onChange={(event: ChangeEvent<HTMLInputElement>) => setTransactionValue(event.target.value)}
                aria-invalid={Boolean(errors.transactionValue)}
                aria-describedby="transactionValue-help"
                className="w-full rounded-md border border-slate-300 px-4 py-3 text-sm text-ink outline-none transition-colors focus:border-primary"
              />
              <p id="transactionValue-help" className="mt-1.5 text-xs text-muted">
                The full consideration/sale price for the land or building, before any fees.
              </p>
              {errors.transactionValue && (
                <p className="mt-1.5 text-sm text-red-600">{errors.transactionValue}</p>
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
                <ResultRow label="Transaction value" value={formatNaira(result.transactionValueKobo)} />
                {result.isExempt ? (
                  <ResultRow
                    label="Stamp duty"
                    value="Exempt"
                    hint="Below the ₦10,000,000 exemption threshold"
                  />
                ) : (
                  <ResultRow label="Estimated stamp duty (1.5%)" value={formatNaira(result.stampDutyKobo)} />
                )}
                <ResultRow
                  label="Transaction value + stamp duty"
                  value={formatNaira(result.totalKobo)}
                  emphasis
                  hint="Excludes consent fees, registration, legal fees and CGT — see notes below"
                />
              </ResultCard>
            ) : (
              <div className="flex h-full min-h-[220px] items-center justify-center rounded-xl border border-dashed border-slate-300 p-6 text-center text-sm text-muted">
                Enter a transaction value and select Calculate to see the estimated stamp duty.
              </div>
            )}

            <div className="mt-6 rounded-lg border border-slate-200 bg-white p-5 text-xs leading-relaxed text-muted">
              <h4 className="text-sm font-semibold text-ink">How this is calculated</h4>
              <p className="mt-2">
                Transactions under ₦10,000,000 are exempt. At or above that threshold, stamp duty is
                1.5% of the full transaction value — there is no partial exemption on the first
                ₦10,000,000 once you&apos;re over the threshold; the whole amount is dutiable.
              </p>
            </div>

            <SourceList sources={[NIGERIA_PROPERTY_STAMP_DUTY_RULE]} />
            <CalculatorDisclaimer />
          </div>
        </div>
      </Container>
    </section>
  );
}
