export const formatCurrency = (value: number, currency = "USD"): string => {
  return new Intl.NumberFormat(`en-${currency.slice(0, 2).toUpperCase()}`, {
    style: "currency",
    currency: currency?.toUpperCase() || "USD",
    maximumSignificantDigits: 6,
  }).format(value);
};

export const web3ActionDescriptions = {
  "Buy / Sell": "Buy or sell tokens",
  Send: "Send tokens to another address",
  Swap: "Swap tokens for another token",
};
