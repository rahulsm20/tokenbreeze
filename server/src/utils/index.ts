import BigNumber from "bignumber.js";

export function fromReadableAmount(
  amount: number,
  decimals: number
): BigNumber {
  return new BigNumber(amount).times(new BigNumber(10).pow(decimals));
}
