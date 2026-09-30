import { nairaToKobo, type Kobo } from "./money";

export type DistanceUnit = "km" | "miles";
export type FuelEfficiencyUnit = "l_per_100km" | "km_per_litre";

export type FuelCalculatorInput = {
  annualDistance: number;
  distanceUnit: DistanceUnit;
  fuelPricePerLitre: number;
  efficiency: number;
  efficiencyUnit: FuelEfficiencyUnit;
};

export type FuelCalculatorResult = {
  annualDistanceKm: number;
  annualLitres: number;
  annualCostKobo: Kobo;
  monthlyCostKobo: Kobo;
  weeklyCostKobo: Kobo;
};

const KM_PER_MILE = 1.609344;

export function calculateFuelCost(input: FuelCalculatorInput): FuelCalculatorResult {
  const annualDistanceKm = input.distanceUnit === "miles" ? input.annualDistance * KM_PER_MILE : input.annualDistance;

  const annualLitres =
    input.efficiencyUnit === "l_per_100km"
      ? (annualDistanceKm * input.efficiency) / 100
      : annualDistanceKm / input.efficiency;

  const pricePerLitreKobo = nairaToKobo(input.fuelPricePerLitre);
  const annualCostKobo = Math.round(annualLitres * pricePerLitreKobo);

  return {
    annualDistanceKm,
    annualLitres,
    annualCostKobo,
    monthlyCostKobo: Math.round(annualCostKobo / 12),
    weeklyCostKobo: Math.round(annualCostKobo / 52),
  };
}

export type FuelInputErrors = Partial<Record<"annualDistance" | "fuelPricePerLitre" | "efficiency", string>>;

export function validateFuelInput(input: FuelCalculatorInput): FuelInputErrors {
  const errors: FuelInputErrors = {};

  if (!Number.isFinite(input.annualDistance) || input.annualDistance <= 0) {
    errors.annualDistance = "Enter a distance greater than zero.";
  }
  if (!Number.isFinite(input.fuelPricePerLitre) || input.fuelPricePerLitre <= 0) {
    errors.fuelPricePerLitre = "Enter a fuel price greater than zero.";
  }
  if (!Number.isFinite(input.efficiency) || input.efficiency <= 0) {
    errors.efficiency = "Enter a fuel efficiency figure greater than zero.";
  }

  return errors;
}
