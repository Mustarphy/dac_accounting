/**
 * All currency amounts in the calculators are handled as integer kobo
 * (1 Naira = 100 kobo), not floating-point Naira. Converting to kobo once
 * at the input boundary and doing all arithmetic on integers avoids the
 * classic binary-float rounding drift (e.g. 0.1 + 0.2 !== 0.3) for the
 * additions/subtractions that dominate these calculations. Rate
 * multiplication (e.g. amount * 0.075 for VAT) still touches floating
 * point, but only once per figure with a single round() — the same
 * approach payment processors use for cents-level math — rather than
 * accumulating error across a chain of operations.
 */
export type Kobo = number;

export function nairaToKobo(naira: number): Kobo {
  return Math.round(naira * 100);
}

export function koboToNaira(kobo: Kobo): number {
  return kobo / 100;
}

const nairaFormatter = new Intl.NumberFormat("en-NG", {
  style: "currency",
  currency: "NGN",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export function formatNaira(kobo: Kobo): string {
  return nairaFormatter.format(koboToNaira(kobo));
}

const percentFormatter = new Intl.NumberFormat("en-NG", {
  style: "percent",
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
});

export function formatPercent(rate: number): string {
  return percentFormatter.format(rate);
}
