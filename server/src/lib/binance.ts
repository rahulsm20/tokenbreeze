import { logger } from "@/logger";
import { DateRange } from "@/types";
import { convertCurrency } from "@/utils";
import { cacheData, retrieveCachedData } from "@/utils/redis";
import axios, { AxiosInstance } from "axios";

class BinanceClient {
  private base_url: string;
  private api: AxiosInstance;
  constructor() {
    this.base_url = `https://api.binance.us/api/v3`;
    this.api = axios.create({
      baseURL: this.base_url,
    });
  }
  async getPrice(token: string, currency: string = "USD") {
    try {
      const CURRENCY_TOKEN =
        currency === "usd" ? "USDT" : currency.toUpperCase();
      const symbol = `${token}USDT`.toUpperCase();
      const url = `${this.base_url}/ticker/price?symbol=${symbol}`;
      const response = await this.api.get(url);
      const cacheKey = `binance:${symbol}:${CURRENCY_TOKEN}`;
      const cachedData = await retrieveCachedData(cacheKey);
      if (cachedData) {
        return JSON.parse(cachedData);
      }
      if (CURRENCY_TOKEN !== "USDT") {
        const currencyConversion = await convertCurrency(
          "USD",
          CURRENCY_TOKEN,
          1
        );
        response.data.price = Number(response.data.price) * currencyConversion;
        console.log({ currencyConversion });
      }
      await cacheData(cacheKey, JSON.stringify(response.data));
      return response.data;
    } catch (err) {
      console.error("Error fetching exchange rates:", err);
      logger.error("Error fetching exchange rates:", err);
    }
  }
  async getHistoricalData(
    token: string,
    dateRange: DateRange,
    currency: string = "usd"
  ) {
    const intervalMap = {
      [DateRange.one_hour]: { interval: "1m", limit: 60 },
      [DateRange.twenty_four_hours]: { interval: "5m", limit: 288 }, // 12/hr * 24 = 288
      [DateRange.seven_days]: { interval: "1h", limit: 168 }, // 24*7 = 168
      [DateRange.thirty_days]: { interval: "4h", limit: 180 }, // 6/day * 30
    };

    const CURRENCY_TOKEN = currency === "usd" ? "USDT" : currency.toUpperCase();

    try {
      const symbol = `${token}USDT`.toUpperCase();
      const url = `${this.base_url}/klines?symbol=${symbol}&interval=${intervalMap[dateRange].interval}&limit=${intervalMap[dateRange].limit}`;
      const response = await this.api.get(url);
      if (!response.data || !Array.isArray(response.data)) {
        throw new Error("Invalid response data format from Binance API");
      }
      // if currency is not USD, we need to convert the data
      if (CURRENCY_TOKEN !== "USDT") {
        const currencyConversion = await convertCurrency(
          "USD",
          CURRENCY_TOKEN,
          1
        );
        response.data = response.data.map((item: any) => {
          return [
            item[0], // Open time
            item[1] * currencyConversion, // Open
            item[2] * currencyConversion, // High
            item[3] * currencyConversion, // Low
            item[4] * currencyConversion, // Close
            item[5], // Volume
            item[6], // Close time
            item[7], // Quote asset volume
            item[8], // Number of trades
            item[9], // Taker buy base asset volume
            item[10], // Taker buy quote asset volume
          ];
        });
      }
      const cacheKey = `binance:${token}-${CURRENCY_TOKEN}-${dateRange}`;
      const cachedData = await retrieveCachedData(cacheKey);
      if (cachedData) {
        return JSON.parse(cachedData);
      }
      await cacheData(cacheKey, JSON.stringify(response.data));
      return response.data;
    } catch (err) {
      console.error("Error fetching historical data:", err);
    }
  }
}

export const binanceClient = new BinanceClient();
