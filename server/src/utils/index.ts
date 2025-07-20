import { DateRange } from "@/types";
import axios from "axios";
import BigNumber from "bignumber.js";
import { cacheData, retrieveCachedData } from "./redis";

export function fromReadableAmount(
  amount: number,
  decimals: number
): BigNumber {
  return new BigNumber(amount).times(new BigNumber(10).pow(decimals));
}

export const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

export const generateTimeRange = (dateRange: DateRange) => {
  const endTime = new Date();
  let startTime;
  switch (dateRange) {
    case DateRange.one_hour:
      startTime = new Date(endTime.getTime() - 60 * 60 * 1000);
      break;
    case DateRange.seven_days:
      startTime = new Date(endTime.getTime() - 7 * 24 * 60 * 60 * 1000);
      break;
    case DateRange.twenty_four_hours:
      startTime = new Date(endTime.getTime() - 24 * 60 * 60 * 1000);
      break;
    case DateRange.thirty_days:
      startTime = new Date(endTime.getTime() - 30 * 24 * 60 * 60 * 1000);
      break;
  }
  return { startTime: startTime.toISOString(), endTime: endTime.toISOString() };
};

export const normalizeTimestamp = (ts: number, granularity: number) =>
  Math.floor(ts / (granularity * 1000)) * (granularity * 1000);

export const granularityMap = {
  [DateRange.one_hour]: 60,
  [DateRange.twenty_four_hours]: 300,
  [DateRange.seven_days]: 3600,
  [DateRange.thirty_days]: 21600,
};

export async function convertCurrency(
  from: string = "USD",
  to: string,
  amount: number
) {
  if (from === to) return amount;
  const cacheKey = `currency-conversion`;
  const cachedData = await retrieveCachedData(cacheKey);
  if (cachedData) {
    return Number(JSON.parse(cachedData).rates[to]) * amount;
  }
  const prices = await axios.get("https://api.frankfurter.app/latest?from=USD");
  const price = prices.data?.rates[to];
  if (!price || !prices.data) {
    throw new Error(`Conversion rate for ${to} not found`);
  }
  await cacheData(cacheKey, JSON.stringify(prices.data), "1 day");
  return amount * price;
}
