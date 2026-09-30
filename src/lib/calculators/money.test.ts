import { describe, expect, it } from "vitest";
import { formatNaira, koboToNaira, nairaToKobo } from "./money";

describe("money", () => {
  it("converts Naira to kobo without float drift", () => {
    expect(nairaToKobo(100)).toBe(10_000);
    expect(nairaToKobo(0.1)).toBe(10);
    expect(nairaToKobo(1234.56)).toBe(123_456);
  });

  it("round-trips kobo back to Naira", () => {
    expect(koboToNaira(10_000)).toBe(100);
    expect(koboToNaira(123_456)).toBe(1234.56);
  });

  it("sums amounts that are notorious for binary float drift", () => {
    // 0.1 + 0.2 !== 0.3 in plain floating point; kobo (integers) avoids it.
    const a = nairaToKobo(0.1);
    const b = nairaToKobo(0.2);
    expect(a + b).toBe(nairaToKobo(0.3));
  });

  it("formats kobo as a Naira currency string", () => {
    expect(formatNaira(123_456)).toBe("₦1,234.56");
    expect(formatNaira(0)).toBe("₦0.00");
  });
});
