import { describe, expect, it } from "vitest";
import { calculateVat, validateVatInput } from "./vat";

describe("calculateVat", () => {
  it("adds 7.5% VAT to a VAT-exclusive amount", () => {
    const result = calculateVat({ amount: 100_000, direction: "exclusive" });
    expect(result.netAmountKobo).toBe(10_000_000);
    expect(result.vatAmountKobo).toBe(750_000); // 7.5% of ₦100,000 = ₦7,500
    expect(result.grossAmountKobo).toBe(10_750_000);
    expect(result.rate).toBe(0.075);
  });

  it("extracts VAT from a VAT-inclusive amount", () => {
    const result = calculateVat({ amount: 107.5, direction: "inclusive" });
    // net = 107.5 / 1.075 = 100 exactly
    expect(result.netAmountKobo).toBe(10_000);
    expect(result.vatAmountKobo).toBe(750);
    expect(result.grossAmountKobo).toBe(10_750);
  });

  it("exclusive and inclusive directions are inverses of each other", () => {
    const exclusive = calculateVat({ amount: 50_000, direction: "exclusive" });
    const inclusive = calculateVat({
      amount: exclusive.grossAmountKobo / 100,
      direction: "inclusive",
    });
    expect(inclusive.netAmountKobo).toBe(exclusive.netAmountKobo);
    expect(inclusive.vatAmountKobo).toBe(exclusive.vatAmountKobo);
  });

  it("treats a zero amount as zero VAT, not an error", () => {
    const result = calculateVat({ amount: 0, direction: "exclusive" });
    expect(result.vatAmountKobo).toBe(0);
    expect(result.grossAmountKobo).toBe(0);
  });

  it("clamps negative amounts to zero rather than returning negative VAT", () => {
    const result = calculateVat({ amount: -500, direction: "exclusive" });
    expect(result.netAmountKobo).toBe(0);
    expect(result.vatAmountKobo).toBe(0);
  });
});

describe("validateVatInput", () => {
  it("rejects zero or negative amounts", () => {
    expect(validateVatInput({ amount: 0, direction: "exclusive" }).amount).toBeDefined();
    expect(validateVatInput({ amount: -10, direction: "exclusive" }).amount).toBeDefined();
  });

  it("accepts a positive amount", () => {
    expect(validateVatInput({ amount: 1000, direction: "exclusive" })).toEqual({});
  });
});
