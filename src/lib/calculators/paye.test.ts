import { describe, expect, it } from "vitest";
import { calculatePaye, validatePayeInput } from "./paye";

describe("calculatePaye", () => {
  it("charges no tax when income is fully within the ₦800,000 tax-free band", () => {
    const result = calculatePaye({
      grossSalary: 800_000,
      payFrequency: "annual",
      annualRentPaid: 0,
      includePension: false,
    });
    expect(result.annualTaxKobo).toBe(0);
    expect(result.annualNetKobo).toBe(result.grossAnnualKobo);
  });

  it("applies graduated bands correctly for a mid-range salary (manually verified example)", () => {
    // Taxable income ₦5,000,000: 800k@0% + 2.2m@15% + 2m@18%
    // = 0 + 330,000 + 360,000 = ₦690,000
    const result = calculatePaye({
      grossSalary: 5_000_000,
      payFrequency: "annual",
      annualRentPaid: 0,
      includePension: false,
    });
    expect(result.taxableIncomeKobo).toBe(500_000_000);
    expect(result.annualTaxKobo).toBe(69_000_000); // ₦690,000
  });

  it("never taxes more than 25% marginally, even for very high incomes", () => {
    const result = calculatePaye({
      grossSalary: 100_000_000,
      payFrequency: "annual",
      annualRentPaid: 0,
      includePension: false,
    });
    const topBand = result.bands[result.bands.length - 1];
    expect(topBand.rate).toBe(0.25);
  });

  it("deducts the employee's 8% pension contribution before tax when included", () => {
    const withPension = calculatePaye({
      grossSalary: 6_000_000,
      payFrequency: "annual",
      annualRentPaid: 0,
      includePension: true,
    });
    const withoutPension = calculatePaye({
      grossSalary: 6_000_000,
      payFrequency: "annual",
      annualRentPaid: 0,
      includePension: false,
    });

    expect(withPension.pensionDeductionKobo).toBe(Math.round(6_000_000 * 100 * 0.08));
    expect(withPension.taxableIncomeKobo).toBeLessThan(withoutPension.taxableIncomeKobo);
    // Employer's 10% contribution must never reduce the employee's net pay.
    expect(withPension.employerPensionContributionKobo).toBe(Math.round(6_000_000 * 100 * 0.1));
    expect(withPension.annualNetKobo).toBe(
      withPension.grossAnnualKobo - withPension.pensionDeductionKobo - withPension.annualTaxKobo
    );
  });

  it("caps rent relief at ₦500,000 even for very high rent", () => {
    const result = calculatePaye({
      grossSalary: 10_000_000,
      payFrequency: "annual",
      annualRentPaid: 10_000_000, // 20% of this would be ₦2,000,000, well above the cap
      includePension: false,
    });
    expect(result.rentReliefKobo).toBe(50_000_000); // ₦500,000 cap
  });

  it("applies rent relief below the cap as 20% of rent paid", () => {
    const result = calculatePaye({
      grossSalary: 10_000_000,
      payFrequency: "annual",
      annualRentPaid: 1_000_000, // 20% = ₦200,000, below the cap
      includePension: false,
    });
    expect(result.rentReliefKobo).toBe(20_000_000); // ₦200,000
  });

  it("annualises a monthly gross salary before applying bands", () => {
    const monthly = calculatePaye({
      grossSalary: 500_000,
      payFrequency: "monthly",
      annualRentPaid: 0,
      includePension: false,
    });
    const annual = calculatePaye({
      grossSalary: 6_000_000,
      payFrequency: "annual",
      annualRentPaid: 0,
      includePension: false,
    });
    expect(monthly.grossAnnualKobo).toBe(annual.grossAnnualKobo);
    expect(monthly.annualTaxKobo).toBe(annual.annualTaxKobo);
  });

  it("never lets taxable income go negative when reliefs exceed gross income", () => {
    const result = calculatePaye({
      grossSalary: 500_000,
      payFrequency: "annual",
      annualRentPaid: 50_000_000, // relief capped at 500k, still less than gross here, but exercise the floor
      includePension: true,
    });
    expect(result.taxableIncomeKobo).toBeGreaterThanOrEqual(0);
  });

  it("treats a zero salary as zero tax without throwing", () => {
    const result = calculatePaye({
      grossSalary: 0,
      payFrequency: "annual",
      annualRentPaid: 0,
      includePension: false,
    });
    expect(result.annualTaxKobo).toBe(0);
    expect(result.bands).toEqual([]);
  });
});

describe("validatePayeInput", () => {
  it("rejects a zero or negative gross salary", () => {
    expect(
      validatePayeInput({ grossSalary: 0, payFrequency: "annual", annualRentPaid: 0, includePension: false })
        .grossSalary
    ).toBeDefined();
  });

  it("rejects negative rent but allows zero rent", () => {
    expect(
      validatePayeInput({ grossSalary: 1_000_000, payFrequency: "annual", annualRentPaid: -1, includePension: false })
        .annualRentPaid
    ).toBeDefined();
    expect(
      validatePayeInput({ grossSalary: 1_000_000, payFrequency: "annual", annualRentPaid: 0, includePension: false })
    ).toEqual({});
  });
});
