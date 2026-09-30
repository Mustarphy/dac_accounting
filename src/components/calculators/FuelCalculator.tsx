"use client";

import { useState, type ChangeEvent, type FormEvent } from "react";
import { RotateCcw } from "lucide-react";
import Container from "@/components/ui/Container";
import ResultCard from "@/components/calculators/ResultCard";
import ResultRow from "@/components/calculators/ResultRow";
import CalculatorDisclaimer from "@/components/calculators/CalculatorDisclaimer";
import {
  calculateFuelCost,
  validateFuelInput,
  type DistanceUnit,
  type FuelCalculatorResult,
  type FuelEfficiencyUnit,
  type FuelInputErrors,
} from "@/lib/calculators/fuel";
import { formatNaira } from "@/lib/calculators/money";

type Fields = {
  annualDistance: string;
  distanceUnit: DistanceUnit;
  fuelPricePerLitre: string;
  efficiency: string;
  efficiencyUnit: FuelEfficiencyUnit;
};

const initialFields: Fields = {
  annualDistance: "",
  distanceUnit: "km",
  fuelPricePerLitre: "",
  efficiency: "",
  efficiencyUnit: "l_per_100km",
};

export default function FuelCalculator() {
  const [fields, setFields] = useState<Fields>(initialFields);
  const [errors, setErrors] = useState<FuelInputErrors>({});
  const [result, setResult] = useState<FuelCalculatorResult | null>(null);

  function handleChange<K extends keyof Fields>(field: K) {
    return (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      setFields((prev) => ({ ...prev, [field]: event.target.value as Fields[K] }));
    };
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const input = {
      annualDistance: Number(fields.annualDistance),
      distanceUnit: fields.distanceUnit,
      fuelPricePerLitre: Number(fields.fuelPricePerLitre),
      efficiency: Number(fields.efficiency),
      efficiencyUnit: fields.efficiencyUnit,
    };

    const validationErrors = validateFuelInput(input);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) {
      setResult(null);
      return;
    }

    setResult(calculateFuelCost(input));
  }

  function handleReset() {
    setFields(initialFields);
    setErrors({});
    setResult(null);
  }

  return (
    <section id="fuel" className="scroll-mt-24 border-t border-slate-200 py-16 lg:py-20">
      <Container>
        <div className="max-w-2xl">
          <h2 className="text-2xl font-bold tracking-tight text-ink sm:text-3xl">Fuel Calculator</h2>
          <p className="mt-3 text-sm leading-relaxed text-muted">
            Estimate how much you&apos;re likely to spend on fuel each year, month and week based on
            your distance travelled, your vehicle&apos;s efficiency, and the price you pay per litre.
          </p>
        </div>

        <div className="mt-8 grid gap-8 lg:grid-cols-2 lg:gap-12">
          <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
            <div>
              <label htmlFor="annualDistance" className="mb-2 block text-sm font-medium text-ink">
                Annual distance travelled
              </label>
              <div className="flex gap-2">
                <input
                  id="annualDistance"
                  name="annualDistance"
                  type="number"
                  inputMode="decimal"
                  min="0"
                  step="any"
                  value={fields.annualDistance}
                  onChange={handleChange("annualDistance")}
                  aria-invalid={Boolean(errors.annualDistance)}
                  aria-describedby={errors.annualDistance ? "annualDistance-error" : undefined}
                  className="w-full rounded-md border border-slate-300 px-4 py-3 text-sm text-ink outline-none transition-colors focus:border-primary"
                />
                <select
                  aria-label="Distance unit"
                  value={fields.distanceUnit}
                  onChange={handleChange("distanceUnit")}
                  className="rounded-md border border-slate-300 bg-white px-3 py-3 text-sm text-ink outline-none transition-colors focus:border-primary"
                >
                  <option value="km">km</option>
                  <option value="miles">miles</option>
                </select>
              </div>
              {errors.annualDistance && (
                <p id="annualDistance-error" className="mt-1.5 text-sm text-red-600">
                  {errors.annualDistance}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="fuelPricePerLitre" className="mb-2 block text-sm font-medium text-ink">
                Fuel price per litre (₦)
              </label>
              <input
                id="fuelPricePerLitre"
                name="fuelPricePerLitre"
                type="number"
                inputMode="decimal"
                min="0"
                step="any"
                value={fields.fuelPricePerLitre}
                onChange={handleChange("fuelPricePerLitre")}
                aria-invalid={Boolean(errors.fuelPricePerLitre)}
                aria-describedby="fuelPricePerLitre-help"
                className="w-full rounded-md border border-slate-300 px-4 py-3 text-sm text-ink outline-none transition-colors focus:border-primary"
              />
              <p id="fuelPricePerLitre-help" className="mt-1.5 text-xs text-muted">
                Enter the current pump price you pay — this varies by location and fuel type, so we
                don&apos;t assume a figure for you.
              </p>
              {errors.fuelPricePerLitre && (
                <p className="mt-1.5 text-sm text-red-600">{errors.fuelPricePerLitre}</p>
              )}
            </div>

            <div>
              <label htmlFor="efficiency" className="mb-2 block text-sm font-medium text-ink">
                Vehicle fuel efficiency
              </label>
              <div className="flex gap-2">
                <input
                  id="efficiency"
                  name="efficiency"
                  type="number"
                  inputMode="decimal"
                  min="0"
                  step="any"
                  value={fields.efficiency}
                  onChange={handleChange("efficiency")}
                  aria-invalid={Boolean(errors.efficiency)}
                  className="w-full rounded-md border border-slate-300 px-4 py-3 text-sm text-ink outline-none transition-colors focus:border-primary"
                />
                <select
                  aria-label="Efficiency unit"
                  value={fields.efficiencyUnit}
                  onChange={handleChange("efficiencyUnit")}
                  className="w-48 shrink-0 rounded-md border border-slate-300 bg-white px-3 py-3 text-sm text-ink outline-none transition-colors focus:border-primary"
                >
                  <option value="l_per_100km">litres / 100km</option>
                  <option value="km_per_litre">km / litre</option>
                </select>
              </div>
              {errors.efficiency && <p className="mt-1.5 text-sm text-red-600">{errors.efficiency}</p>}
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
                <ResultRow label="Estimated annual fuel consumption" value={`${result.annualLitres.toFixed(1)} litres`} />
                <ResultRow label="Estimated weekly cost" value={formatNaira(result.weeklyCostKobo)} />
                <ResultRow label="Estimated monthly cost" value={formatNaira(result.monthlyCostKobo)} />
                <ResultRow label="Estimated annual cost" value={formatNaira(result.annualCostKobo)} emphasis />
              </ResultCard>
            ) : (
              <div className="flex h-full min-h-[220px] items-center justify-center rounded-xl border border-dashed border-slate-300 p-6 text-center text-sm text-muted">
                Fill in the form and select Calculate to see your estimated fuel costs.
              </div>
            )}

            <div className="mt-6 rounded-lg border border-slate-200 bg-white p-5 text-xs leading-relaxed text-muted">
              <h4 className="text-sm font-semibold text-ink">How this is calculated</h4>
              <p className="mt-2">
                Annual litres = distance × (litres per 100km ÷ 100), or distance ÷ (km per litre).
                Annual cost = annual litres × price per litre. Monthly and weekly figures divide the
                annual cost evenly (÷12 and ÷52) — they don&apos;t account for seasonal driving
                variation. Miles are converted to kilometres (1 mile = 1.609344 km) before any other
                calculation.
              </p>
            </div>

            <CalculatorDisclaimer />
          </div>
        </div>
      </Container>
    </section>
  );
}
