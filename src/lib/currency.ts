// Static reference exchange rates, expressed as "units of target currency per 1 INR".
// INR is the base currency because all service pricing originates in INR.
// Rates are approximate manual snapshots (not live) -- update periodically if precision matters.
export type CurrencyCode = "INR" | "USD" | "EUR" | "GBP" | "AUD" | "CAD" | "JPY" | "SGD" | "AED" | "BRL" | "PKR";

export interface CurrencyDef {
  code: CurrencyCode;
  symbol: string;
  label: string;
  ratePerINR: number;
  maxFractionDigits: number;
}

export const CURRENCIES: CurrencyDef[] = [
  { code: "INR", symbol: "\u20B9", label: "Indian Rupee", ratePerINR: 1, maxFractionDigits: 0 },
  { code: "USD", symbol: "$", label: "US Dollar", ratePerINR: 1 / 83, maxFractionDigits: 2 },
  { code: "EUR", symbol: "\u20AC", label: "Euro", ratePerINR: 1 / 90, maxFractionDigits: 2 },
  { code: "GBP", symbol: "\u00A3", label: "British Pound", ratePerINR: 1 / 105, maxFractionDigits: 2 },
  { code: "AUD", symbol: "A$", label: "Australian Dollar", ratePerINR: 1 / 55, maxFractionDigits: 2 },
  { code: "CAD", symbol: "C$", label: "Canadian Dollar", ratePerINR: 1 / 61, maxFractionDigits: 2 },
  { code: "JPY", symbol: "\u00A5", label: "Japanese Yen", ratePerINR: 1.79, maxFractionDigits: 0 },
  { code: "SGD", symbol: "S$", label: "Singapore Dollar", ratePerINR: 1 / 62, maxFractionDigits: 2 },
  { code: "AED", symbol: "AED ", label: "UAE Dirham", ratePerINR: 1 / 22.6, maxFractionDigits: 2 },
  { code: "BRL", symbol: "R$", label: "Brazilian Real", ratePerINR: 1 / 14, maxFractionDigits: 2 },
  { code: "PKR", symbol: "Rs ", label: "Pakistani Rupee", ratePerINR: 3.35, maxFractionDigits: 0 },
];

export const DEFAULT_CURRENCY: CurrencyCode = "INR";

export function getCurrencyDef(code: CurrencyCode): CurrencyDef {
  return CURRENCIES.find((c) => c.code === code) ?? CURRENCIES[0];
}

// amountINR: numeric price denominated in INR.
export function formatFromINR(amountINR: number, code: CurrencyCode): string {
  const def = getCurrencyDef(code);
  const value = amountINR * def.ratePerINR;
  const formatted = value.toLocaleString("en-US", {
    minimumFractionDigits: def.maxFractionDigits,
    maximumFractionDigits: def.maxFractionDigits,
  });
  return `${def.symbol}${formatted}`;
}

// amountUSD: numeric price denominated in USD (used for store products priced natively in USD).
export function formatFromUSD(amountUSD: number, code: CurrencyCode): string {
  const usdDef = getCurrencyDef("USD");
  const amountINR = amountUSD / usdDef.ratePerINR;
  return formatFromINR(amountINR, code);
}
