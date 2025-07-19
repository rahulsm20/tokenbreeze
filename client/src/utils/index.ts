export const formatCurrency = (value: number, currency = "USD"): string => {
  return new Intl.NumberFormat(`en-${currency.slice(0, 2).toUpperCase()}`, {
    style: "currency",
    currency: currency?.toUpperCase() || "USD",
    maximumSignificantDigits: 6,
  }).format(parseFloat(value.toFixed(4)));
};

export const web3ActionDescriptions = {
  "Buy / Sell": "Buy or sell tokens",
  Send: "Send tokens to another address",
  Swap: "Swap tokens for another token",
};

export function normalizeDate(date: number, granularityMs: number): number {
  return Math.floor(date / granularityMs) * granularityMs;
}
