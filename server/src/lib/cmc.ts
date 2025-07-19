//-----------------------------------------------------------

import { CMCResultType } from "@/types";
import { cacheData, retrieveCachedData } from "@/utils/redis";
import axios, { AxiosInstance } from "axios";
import dayjs from "dayjs";

//-----------------------------------------------------------
class CoinMarketCapInstance {
  private base_url: string;
  private api: AxiosInstance;
  constructor() {
    this.base_url = `https://pro-api.coinmarketcap.com`;
    this.api = axios.create({
      baseURL: this.base_url,
      headers: {
        "X-CMC_PRO_API_KEY": process.env.COIN_MARKET_CAP_API_KEY,
      },
    });
  }
  async getLatestListings(
    currency: string = "usd",
    start: number = 1,
    limit: number = 10
  ) {
    try {
      const url = `${this.base_url}/v1/cryptocurrency/listings/latest?convert=${currency}&start=${start}&limit=${limit}`;
      const today = dayjs().format("YYYY-MM-DD");
      const cacheKey = `cmc:listings:${today}:${currency}:${start}:${limit}`;
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
  async getLatestQuotes(symbol: string) {
    try {
      const url = `${this.base_url}/v2/cryptocurrency/quotes/latest`;
      const cacheKey = `cmc:${symbol}:${dayjs().format("YYYY-MM-DD")}`;
      const cachedData = await retrieveCachedData(cacheKey);
      if (cachedData) {
        return JSON.parse(cachedData);
      }
      const response = await this.api.get(url, { params: { symbol } });
      const data = await response.data;
      await cacheData(cacheKey, JSON.stringify(data));
      return data;
    } catch (err) {
      console.log(err);
      return;
    }
  }
  async searchListings(
    query: string,
    currency: string = "usd",
    page: number = 1
  ) {
    try {
      const url = `${this.base_url}/v1/cryptocurrency/search`;
      const cacheKey = `cmc:search:${query}:${currency}:${page}`;
      const cachedData = await retrieveCachedData(cacheKey);
      if (cachedData) {
        return JSON.parse(cachedData);
      }
      const response = await this.api.get(url, {
        params: { query, currency, page },
      });
      const data = await response.data;
      await cacheData(cacheKey, JSON.stringify(data), "5 mins");
      return data as CMCResultType;
    } catch (err) {
      console.log(err);
      return err;
    }
  }
}

export const cmcClient = new CoinMarketCapInstance();
