import { logger } from "@/logger";
import { DateRange } from "@/types";
import { generateTimeRange, granularityMap, normalizeTimestamp } from "@/utils";
import axios, { AxiosInstance } from "axios";

class CoinbaseClient {
  private base_url: string;
  private api: AxiosInstance;
  private exchange_api_url: string;
  constructor() {
    this.base_url = `https://api.coinbase.com/v2`;
    this.exchange_api_url = `https://api.exchange.coinbase.com`;
    this.api = axios.create({
      baseURL: this.base_url,
    });
  }
  async getExchangeRates(currency: string = "USD") {
    try {
      const url = `${this.base_url}/exchange-rates?currency=${currency}`;
      const response = await this.api.get(url);
      return response.data;
    } catch (err) {
      console.error("Error fetching exchange rates:", err);
      throw err;
    }
  }
  async getPrice(token: string, currency: string = "USD") {
    try {
      const pair = `${token}-${currency}`.toUpperCase();
      const url = `${this.base_url}/prices/${pair}/spot`;
      const response = await this.api.get(url);
      return response.data;
    } catch (err) {
      logger.error("Error fetching price:", err);
    }
  }
  async getHistoricalData(
    token: string,
    dateRange: DateRange,
    currency: string = "USD"
  ) {
    try {
      const pair = `${token}-${currency}`.toUpperCase();
      const { startTime, endTime } = generateTimeRange(dateRange);
      const granularity = granularityMap[dateRange] || 3600;
      const normalizedStart = normalizeTimestamp(
        new Date(startTime).getTime(),
        granularity
      );
      const normalizedEnd = normalizeTimestamp(
        new Date(endTime).getTime(),
        granularity
      );

      const url = `${
        this.exchange_api_url
      }/products/${pair}/candles?start=${normalizedStart}&end=${normalizedEnd}&granularity=${
        granularityMap[dateRange] || 3600
      }`;
      const response = await this.api.get(url);
      return response.data;
    } catch (err) {
      logger.error("Error fetching historical data:", err);
    }
  }
}

export const coinbaseClient = new CoinbaseClient();
