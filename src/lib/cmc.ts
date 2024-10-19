import axios, { AxiosInstance } from "axios";
import dayjs from "dayjs";
import { cacheData, retrieveCachedData } from "../utils/redis";

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
  async getLatestListings() {
    try {
      const url = `${this.base_url}/v1/cryptocurrency/listings/latest`;
      const cacheKey = `cmc:${dayjs().format("YYYY-MM-DD")}`;
      const cachedData = await retrieveCachedData(cacheKey);
      if (cachedData) {
        return JSON.parse(cachedData);
      }
      const response = await this.api.get(url);
      const data = await response.data;
      await cacheData(cacheKey, JSON.stringify(data));
      return data;
    } catch (err) {
      console.log(err);
      return err;
    }
  }
}

export const cmcClient = new CoinMarketCapInstance();
