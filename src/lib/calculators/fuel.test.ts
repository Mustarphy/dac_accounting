import { describe, expect, it } from "vitest";
import { calculateFuelCost, validateFuelInput } from "./fuel";

describe("calculateFuelCost", () => {
  it("calculates cost from litres-per-100km efficiency", () => {
    const result = calculateFuelCost({
      annualDistance: 10_000,
      distanceUnit: "km",
      fuelPricePerLitre: 1000,
      efficiency: 8,
      efficiencyUnit: "l_per_100km",
    });

    // 10,000km * 8L/100km / 100 = 800 litres
    expect(result.annualLitres).toBeCloseTo(800, 5);
    expect(result.annualCostKobo).toBe(80_000_000); // 800 * ₦1000 = ₦800,000
    expect(result.monthlyCostKobo).toBe(Math.round(80_000_000 / 12));
    expect(result.weeklyCostKobo).toBe(Math.round(80_000_000 / 52));
  });

  it("calculates cost from km-per-litre efficiency", () => {
    const result = calculateFuelCost({
      annualDistance: 12_000,
      distanceUnit: "km",
      fuelPricePerLitre: 1000,
      efficiency: 12,
      efficiencyUnit: "km_per_litre",
    });

    // 12,000km / 12km per litre = 1,000 litres
    expect(result.annualLitres).toBeCloseTo(1000, 5);
    expect(result.annualCostKobo).toBe(100_000_000); // ₦1,000,000
  });

  it("converts miles to kilometres before calculating", () => {
    const kmResult = calculateFuelCost({
      annualDistance: 16_093.44,
      distanceUnit: "km",
      fuelPricePerLitre: 1000,
      efficiency: 8,
      efficiencyUnit: "l_per_100km",
    });
    const milesResult = calculateFuelCost({
      annualDistance: 10_000,
      distanceUnit: "miles",
      fuelPricePerLitre: 1000,
      efficiency: 8,
      efficiencyUnit: "l_per_100km",
    });

    expect(milesResult.annualDistanceKm).toBeCloseTo(kmResult.annualDistanceKm, 2);
    expect(milesResult.annualCostKobo).toBe(kmResult.annualCostKobo);
  });
});

describe("validateFuelInput", () => {
  const validInput = {
    annualDistance: 10_000,
    distanceUnit: "km" as const,
    fuelPricePerLitre: 1000,
    efficiency: 8,
    efficiencyUnit: "l_per_100km" as const,
  };

  it("accepts a fully valid input", () => {
    expect(validateFuelInput(validInput)).toEqual({});
  });

  it("rejects zero and negative values", () => {
    const errors = validateFuelInput({ ...validInput, annualDistance: 0, fuelPricePerLitre: -1, efficiency: 0 });
    expect(errors.annualDistance).toBeDefined();
    expect(errors.fuelPricePerLitre).toBeDefined();
    expect(errors.efficiency).toBeDefined();
  });

  it("rejects non-finite values", () => {
    const errors = validateFuelInput({ ...validInput, annualDistance: NaN });
    expect(errors.annualDistance).toBeDefined();
  });
});
