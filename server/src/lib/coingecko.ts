//-----------------------------------------------------------

import { CMCResultType, DateRange } from "@/types";
import { cacheData, retrieveCachedData } from "@/utils/redis";
import axios, { AxiosError, AxiosInstance } from "axios";
import dayjs from "dayjs";
import { logger } from "../logger";

//-----------------------------------------------------------

class CoingeckoInstance {
  private base_url: string;
  private api: AxiosInstance;
  constructor() {
    this.base_url = `https://api.coingecko.com/api`;
    this.api = axios.create({
      baseURL: this.base_url,
      headers: {
        "x-cg-api-key": process.env.COINGECKO_API_KEY,
      },
    });
  }
  async getLatestListings(
    currency: string = "usd",
    page: number = 1,
    limit: number = 10,
    coins?: string[]
  ) {
    try {
      const url =
        `${this.base_url}/v3/coins/markets?vs_currency=${currency}&sparkline=true&page=${page}&per_page=${limit}` +
        (coins ? `&ids=${coins.join(",")}` : "");
      let cacheKey = `cg:listings:${dayjs().format(
        "YYYY-MM-DD"
      )}:${currency}:${page}:${limit}`;
      if (coins) {
        cacheKey += `:${coins.join(",")}`;
      }
      const cachedData = await retrieveCachedData(cacheKey);
      if (cachedData) {
        return JSON.parse(cachedData);
      }
      const response = await this.api.get(url);
      const data = await response.data;
      await cacheData(cacheKey, JSON.stringify(data), "5 mins");
      return data as CMCResultType;
    } catch (err) {
      console.log(err);
      return err;
    }
  }
  async getHistoricalData(
    symbol: string,
    dateRange: DateRange,
    currency: string
  ) {
    try {
      let from;
      const to = dayjs().unix();
      switch (dateRange) {
        case DateRange.one_hour:
          from = dayjs().subtract(1, "hour").unix();
          break;
        case DateRange.twenty_four_hours:
          from = dayjs().subtract(1, "day").unix();
          break;
        case DateRange.seven_days:
          from = dayjs().subtract(7, "day").unix();
          break;
        case DateRange.thirty_days:
          from = dayjs().subtract(30, "day").unix();
          break;
        default:
          from = dayjs().subtract(1, "day").unix();
          break;
      }
      const url = `${this.base_url}/v3/coins/${symbol}/market_chart/range?vs_currency=${currency}&from=${from}&to=${to}`;
      const cacheKey = `cg:historical:${symbol}:${from}:${to}:${currency}`;
      const cachedData = await retrieveCachedData(cacheKey);
      if (cachedData) {
        let data = JSON.parse(cachedData);

        // Convert date strings back to Date objects
        data = data.map((item: any) => ({
          ...item,
          date: new Date(item.date),
        }));
        return data;
      }

      const response = await this.api.get(url, { params: { symbol } });
      const data = await response.data;
      if (!data || data.length === 0) {
        logger.warn("No historical data found for", {
          symbol,
          dateRange,
          currency,
        });
        return null;
      } else {
        await cacheData(cacheKey, JSON.stringify(data));
      }
      return data;
    } catch (err) {
      if (err instanceof AxiosError) {
        console.log("Error in getHistoricalData", err.response?.data, symbol);
        logger.error("Error in getHistoricalData", {
          message: err.message,
        });
      }
      return err;
    }
  }
  async getCoinData(symbol: string) {
    try {
      const url = `${this.base_url}/v3/simple/price?ids=${symbol}&vs_currencies=usd`;
      const cacheKey = `cg:coin:${symbol}:${dayjs().format("YYYY-MM-DD")}`;
      const cachedData = await retrieveCachedData(cacheKey);
      if (cachedData) {
        return { ...JSON.parse(cachedData), fromCache: true };
      }
      const response = await this.api.get(url);
      const data = await response.data;
      await cacheData(cacheKey, JSON.stringify(data));
      return data;
    } catch (err) {
      return err;
    }
  }
  async searchListings(
    query: string,
    currency: string = "usd",
    page: number = 1
  ) {
    const url = `${this.base_url}/v3/search`;
    const cacheKey = `cg:search:${query}:${currency}:${page}`;
    console.log({ cacheKey });
    const cachedData = await retrieveCachedData(cacheKey);
    if (cachedData) {
      return JSON.parse(cachedData);
    }
    const response = await this.api.get(url, {
      params: { query, currency, page },
    });
    const data = await response.data;
    await cacheData(cacheKey, JSON.stringify(data), "5 mins");
    return data;
  }
}

export const coingeckoClient = new CoingeckoInstance();
