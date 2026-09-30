import { describe, expect, it } from "vitest";
import { calculatePropertyStampDuty, validatePropertyInput } from "./property";

describe("calculatePropertyStampDuty", () => {
  it("exempts transactions below the ₦10,000,000 threshold", () => {
    const result = calculatePropertyStampDuty({ transactionValue: 9_999_999 });
    expect(result.isExempt).toBe(true);
    expect(result.stampDutyKobo).toBe(0);
    expect(result.totalKobo).toBe(result.transactionValueKobo);
  });

  it("charges 1.5% ad valorem on transactions at or above the threshold", () => {
    const result = calculatePropertyStampDuty({ transactionValue: 10_000_000 });
    expect(result.isExempt).toBe(false);
    expect(result.stampDutyKobo).toBe(Math.round(10_000_000 * 100 * 0.015));
  });

  it("scales linearly with transaction value above the threshold", () => {
    const result = calculatePropertyStampDuty({ transactionValue: 50_000_000 });
    expect(result.stampDutyKobo).toBe(Math.round(50_000_000 * 100 * 0.015)); // ₦750,000
    expect(result.totalKobo).toBe(result.transactionValueKobo + result.stampDutyKobo);
  });

  it("treats the boundary value exactly at the threshold as not exempt", () => {
    const belowThreshold = calculatePropertyStampDuty({ transactionValue: 9_999_999.99 });
    const atThreshold = calculatePropertyStampDuty({ transactionValue: 10_000_000 });
    expect(belowThreshold.isExempt).toBe(true);
    expect(atThreshold.isExempt).toBe(false);
  });
});

describe("validatePropertyInput", () => {
  it("rejects zero or negative transaction values", () => {
    expect(validatePropertyInput({ transactionValue: 0 }).transactionValue).toBeDefined();
    expect(validatePropertyInput({ transactionValue: -1 }).transactionValue).toBeDefined();
  });
});
