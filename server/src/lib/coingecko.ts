import axios, { AxiosInstance } from "axios";
import dayjs from "dayjs";
import { cacheData, retrieveCachedData } from "../utils/redis";
import { CMCResultType, DateRange } from "../../types";

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
  async getLatestListings() {
    try {
      const url = `${this.base_url}/v3/coins/markets?vs_currency=usd`;
      const cacheKey = `cg:${dayjs().format("YYYY-MM-DD")}`;
      const cachedData = await retrieveCachedData(cacheKey);
      if (cachedData) {
        return JSON.parse(cachedData);
      }
      const response = await this.api.get(url);
      const data = await response.data;
      await cacheData(cacheKey, JSON.stringify(data));
      return data as CMCResultType;
    } catch (err) {
      console.log(err);
      return err;
    }
  }
  async getHistoricalData(symbol: string, dateRange: DateRange) {
    try {
      let days = 1;
      switch (dateRange) {
        case DateRange["one_hour"]:
          days = 1;
          break;
        case DateRange["twenty_four_hours"]:
          days = 1;
          break;
        case DateRange["seven_days"]:
          days = 7;
          break;
        case DateRange["thirty_days"]:
          days = 30;
          break;
        default:
          days = 1;
          break;
      }
      const url = `${this.base_url}/v3/coins/${symbol}/market_chart?vs_currency=usd&days=${days}`;
      const cacheKey = `cg:historical:${symbol}:${dayjs().format(
        "YYYY-MM-DD"
      )}:${days}`;
      const cachedData = await retrieveCachedData(cacheKey);
      if (cachedData) {
        return JSON.parse(cachedData);
      }
      const response = await this.api.get(url, { params: { symbol } });
      const data = await response.data;
      await cacheData(cacheKey, JSON.stringify(data));
      return data;
    } catch (err) {
      return err;
    }
  }
  async getCoinData(symbol: string) {
    try {
      const url = `${this.base_url}/v3/coins/${symbol}`;
      const cacheKey = `cg:coin:${symbol}:${dayjs().format("YYYY-MM-DD")}`;
      const cachedData = await retrieveCachedData(cacheKey);
      if (cachedData) {
        return JSON.parse(cachedData);
      }
      const response = await this.api.get(url);
      const data = await response.data;
      await cacheData(cacheKey, JSON.stringify(data));
      return data;
    } catch (err) {
      return err;
    }
  }
}

export const coingeckoClient = new CoingeckoInstance();
