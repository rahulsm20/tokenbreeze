//-----------------------------------------------------------

import { cacheData, retrieveCachedData } from "@/utils/redis";
import { IRestClient, restClient } from "@polygon.io/client-js";
import dayjs from "dayjs";
import dotenv from "dotenv";
dotenv.config();

//-----------------------------------------------------------

export const polygonClient = restClient(process.env.POLYGON_API_KEY);

//-----------------------------------------------------------

class PolygonClientInstance {
  private client: IRestClient;
  constructor() {
    this.client = polygonClient;
  }

  async getLatestListings() {
    try {
      const cacheKey = `polygon:listings:${dayjs().format("YYYY-MM-DD")}`;
      const cachedData = await retrieveCachedData(cacheKey);
      if (cachedData) {
        return JSON.parse(cachedData);
      }
      const listings = await this.client.reference.tickers({
        market: "crypto",
      });
      await cacheData(cacheKey, JSON.stringify(listings));
      return listings;
    } catch (err) {
      console.log(err);
      return err;
    }
  }
  async getHistoricalData(symbol: string, dateRange: string[]) {
    try {
      const cacheKey = `polygon:historical:${symbol}:${dateRange.join("-")}`;
      const cachedData = await retrieveCachedData(cacheKey);
      if (cachedData) {
        return JSON.parse(cachedData);
      }
      const historicalData = await this.client.crypto.aggregates(
        symbol,
        1,
        "day",
        dateRange[0],
        dateRange[1]
      );
      await cacheData(cacheKey, JSON.stringify(historicalData));
      return historicalData;
    } catch (err) {
      console.log(err);
      return err;
    }
  }
}

export const polygonInstance = new PolygonClientInstance();
