export const PRICE_NAIRA_PER_USD = 1_350;
export const NIGERIA_VAT_RATE = 0.075;

export type SupportedCurrency = "NGN" | "USD";

export function detectBrowserCurrency(): SupportedCurrency {
  const locales = navigator.languages?.length ? navigator.languages : [navigator.language];
  if (locales.some((locale) => locale.toUpperCase().endsWith("-NG"))) return "NGN";

  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  return timeZone === "Africa/Lagos" ? "NGN" : "USD";
}

export function formatPrice(
  amount: number,
  currency: SupportedCurrency,
  options: { from?: boolean; plus?: boolean; suffix?: string } = {},
) {
  const formatted = new Intl.NumberFormat(currency === "NGN" ? "en-NG" : "en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amount);

  return `${options.from ? "From " : ""}${formatted}${options.plus ? "+" : ""}${options.suffix ?? ""}`;
}
