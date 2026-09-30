"use client";

import { useState, type ChangeEvent, type FormEvent } from "react";
import { RotateCcw } from "lucide-react";
import Container from "@/components/ui/Container";
import ResultCard from "@/components/calculators/ResultCard";
import ResultRow from "@/components/calculators/ResultRow";
import SourceList from "@/components/calculators/SourceList";
import CalculatorDisclaimer from "@/components/calculators/CalculatorDisclaimer";
import {
  calculatePaye,
  validatePayeInput,
  type PayeCalculatorResult,
  type PayFrequency,
  type PayeInputErrors,
} from "@/lib/calculators/paye";
import { formatNaira, formatPercent } from "@/lib/calculators/money";
import {
  NIGERIA_PENSION_RULE,
  NIGERIA_PIT_RULE,
  NIGERIA_RENT_RELIEF_RULE,
} from "@/lib/calculators/rules/nigeria/personal-income-tax";

type Fields = {
  grossSalary: string;
  payFrequency: PayFrequency;
  annualRentPaid: string;
  includePension: boolean;
};

const initialFields: Fields = {
  grossSalary: "",
  payFrequency: "monthly",
  annualRentPaid: "",
  includePension: true,
};

export default function PayeCalculator() {
  const [fields, setFields] = useState<Fields>(initialFields);
  const [errors, setErrors] = useState<PayeInputErrors>({});
  const [result, setResult] = useState<PayeCalculatorResult | null>(null);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const input = {
      grossSalary: Number(fields.grossSalary),
      payFrequency: fields.payFrequency,
      annualRentPaid: fields.annualRentPaid.trim() === "" ? 0 : Number(fields.annualRentPaid),
      includePension: fields.includePension,
    };

    const validationErrors = validatePayeInput(input);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) {
      setResult(null);
      return;
    }

    setResult(calculatePaye(input));
  }

  function handleReset() {
    setFields(initialFields);
    setErrors({});
    setResult(null);
  }

  return (
    <section id="payslip" className="scroll-mt-24 border-t border-slate-200 bg-primary-light py-16 lg:py-20">
      <Container>
        <div className="max-w-2xl">
          <h2 className="text-2xl font-bold tracking-tight text-ink sm:text-3xl">Payslip Calculator</h2>
          <p className="mt-3 text-sm leading-relaxed text-muted">
            Estimate PAYE (Pay-As-You-Earn) personal income tax and take-home pay under the Nigeria
            Tax Act 2025, effective 1 January 2026.
          </p>
        </div>

        <div className="mt-8 grid gap-8 lg:grid-cols-2 lg:gap-12">
          <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
            <div>
              <span className="mb-2 block text-sm font-medium text-ink">Pay frequency</span>
              <div className="flex gap-3">
                {(["monthly", "annual"] as const).map((frequency) => (
                  <label
                    key={frequency}
                    className="flex flex-1 items-center gap-2 rounded-md border border-slate-300 bg-white px-4 py-3 text-sm capitalize text-ink has-[:checked]:border-primary has-[:checked]:bg-primary-light"
                  >
                    <input
                      type="radio"
                      name="payFrequency"
                      value={frequency}
                      checked={fields.payFrequency === frequency}
                      onChange={() => setFields((prev) => ({ ...prev, payFrequency: frequency }))}
                      className="text-primary focus:ring-primary"
                    />
                    {frequency}
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label htmlFor="grossSalary" className="mb-2 block text-sm font-medium text-ink">
                Gross salary (₦, {fields.payFrequency})
              </label>
              <input
                id="grossSalary"
                name="grossSalary"
                type="number"
                inputMode="decimal"
                min="0"
                step="any"
                value={fields.grossSalary}
                onChange={(event: ChangeEvent<HTMLInputElement>) =>
                  setFields((prev) => ({ ...prev, grossSalary: event.target.value }))
                }
                aria-invalid={Boolean(errors.grossSalary)}
                aria-describedby="grossSalary-help"
                className="w-full rounded-md border border-slate-300 px-4 py-3 text-sm text-ink outline-none transition-colors focus:border-primary"
              />
              <p id="grossSalary-help" className="mt-1.5 text-xs text-muted">
                Total gross pay for the period selected above, before any deductions.
              </p>
              {errors.grossSalary && <p className="mt-1.5 text-sm text-red-600">{errors.grossSalary}</p>}
            </div>

            <div>
              <label htmlFor="annualRentPaid" className="mb-2 block text-sm font-medium text-ink">
                Annual rent paid (₦)
              </label>
              <input
                id="annualRentPaid"
                name="annualRentPaid"
                type="number"
                inputMode="decimal"
                min="0"
                step="any"
                value={fields.annualRentPaid}
                onChange={(event: ChangeEvent<HTMLInputElement>) =>
                  setFields((prev) => ({ ...prev, annualRentPaid: event.target.value }))
                }
                aria-invalid={Boolean(errors.annualRentPaid)}
                aria-describedby="annualRentPaid-help"
                className="w-full rounded-md border border-slate-300 px-4 py-3 text-sm text-ink outline-none transition-colors focus:border-primary"
              />
              <p id="annualRentPaid-help" className="mt-1.5 text-xs text-muted">
                Leave blank or enter 0 if you don&apos;t pay rent. Used for the rent relief deduction
                (20% of rent paid, capped at {formatNaira(NIGERIA_RENT_RELIEF_RULE.capKobo)}).
              </p>
              {errors.annualRentPaid && (
                <p className="mt-1.5 text-sm text-red-600">{errors.annualRentPaid}</p>
              )}
            </div>

            <label className="flex items-start gap-3 rounded-md border border-slate-300 bg-white px-4 py-3 text-sm text-ink">
              <input
                type="checkbox"
                checked={fields.includePension}
                onChange={(event) => setFields((prev) => ({ ...prev, includePension: event.target.checked }))}
                className="mt-0.5 size-4 rounded border-slate-300 text-primary focus:ring-primary"
              />
              <span>
                I contribute to the Contributory Pension Scheme
                <span className="mt-0.5 block text-xs text-muted">
                  Deducts the employee&apos;s {formatPercent(NIGERIA_PENSION_RULE.employeeRate)} pension
                  contribution before tax. Not every employee is enrolled — uncheck this if you
                  aren&apos;t.
                </span>
              </span>
            </label>

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
              <>
                <ResultCard>
                  <ResultRow label="Gross annual income" value={formatNaira(result.grossAnnualKobo)} />
                  {result.pensionDeductionKobo > 0 && (
                    <ResultRow label="Pension contribution (employee)" value={`− ${formatNaira(result.pensionDeductionKobo)}`} />
                  )}
                  {result.rentReliefKobo > 0 && (
                    <ResultRow label="Rent relief" value={`− ${formatNaira(result.rentReliefKobo)}`} />
                  )}
                  <ResultRow label="Taxable income" value={formatNaira(result.taxableIncomeKobo)} />
                  <ResultRow label="Estimated annual PAYE" value={`− ${formatNaira(result.annualTaxKobo)}`} />
                  <ResultRow label="Estimated annual take-home pay" value={formatNaira(result.annualNetKobo)} emphasis />
                  <ResultRow label="Estimated monthly take-home pay" value={formatNaira(result.monthlyNetKobo)} />
                </ResultCard>

                {result.bands.length > 0 && (
                  <div className="mt-6 overflow-x-auto rounded-lg border border-slate-200 bg-white">
                    <table className="w-full text-left text-xs">
                      <caption className="sr-only">Tax band breakdown</caption>
                      <thead className="border-b border-slate-200 text-muted">
                        <tr>
                          <th scope="col" className="px-4 py-2.5 font-medium">Band</th>
                          <th scope="col" className="px-4 py-2.5 font-medium">Rate</th>
                          <th scope="col" className="px-4 py-2.5 text-right font-medium">Tax</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {result.bands.map((band) => (
                          <tr key={band.fromKobo}>
                            <td className="px-4 py-2.5 text-ink">
                              {formatNaira(band.fromKobo)} – {band.toKobo === null ? "above" : formatNaira(band.toKobo)}
                            </td>
                            <td className="px-4 py-2.5 text-ink">{formatPercent(band.rate)}</td>
                            <td className="px-4 py-2.5 text-right text-ink">{formatNaira(band.taxKobo)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {result.employerPensionContributionKobo > 0 && (
                  <p className="mt-3 text-xs text-muted">
                    Your employer also contributes an estimated{" "}
                    {formatNaira(result.employerPensionContributionKobo)} to your pension annually
                    ({formatPercent(NIGERIA_PENSION_RULE.employerRate)}). This is an employer cost —
                    it is not deducted from your pay and is not included in the take-home figures
                    above.
                  </p>
                )}
              </>
            ) : (
              <div className="flex h-full min-h-[220px] items-center justify-center rounded-xl border border-dashed border-slate-300 bg-white p-6 text-center text-sm text-muted">
                Fill in the form and select Calculate to see your estimated take-home pay.
              </div>
            )}

            <div className="mt-6 rounded-lg border border-slate-200 bg-white p-5 text-xs leading-relaxed text-muted">
              <h4 className="text-sm font-semibold text-ink">Assumptions and simplifications</h4>
              <p className="mt-2">
                Taxable income = gross income − employee pension contribution (if applicable) − rent
                relief. Bands are then applied progressively (each band&apos;s rate applies only to
                the income within that band). This calculator does not account for National Housing
                Fund contributions, National Health Insurance Scheme contributions, life insurance
                premium relief, mortgage interest relief, other statutory deductions, or gratuity —
                all of which can further change the result for a given employee. It also assumes the
                whole pay period&apos;s figure is regular salary, not a one-off bonus.
              </p>
            </div>

            <SourceList sources={[NIGERIA_PIT_RULE, NIGERIA_RENT_RELIEF_RULE, NIGERIA_PENSION_RULE]} />
            <CalculatorDisclaimer />
          </div>
        </div>
      </Container>
    </section>
  );
}
