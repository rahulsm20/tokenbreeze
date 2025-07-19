import { DateRange } from "@/types";
import axios, { AxiosInstance } from "axios";

class BinanceClient {
  private base_url: string;
  private api: AxiosInstance;
  constructor() {
    this.base_url = `https://api.binance.com/api/v3`;
    this.api = axios.create({
      baseURL: this.base_url,
    });
  }
  async getPrice(token: string, currency: string = "USD") {
    try {
      const symbol = `${token}USDT`.toUpperCase();
      const url = `${this.base_url}/ticker/price?symbol=${symbol}`;
      const response = await this.api.get(url);
      return response.data;
    } catch (err) {
      console.error("Error fetching exchange rates:", err);
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
      const symbol = `${token}${CURRENCY_TOKEN}`.toUpperCase();
      const url = `${this.base_url}/klines?symbol=${symbol}&interval=${intervalMap[dateRange].interval}&limit=${intervalMap[dateRange].limit}`;
      const response = await this.api.get(url);
      return response.data;
    } catch (err) {
      console.error("Error fetching historical data:", err);
    }
  }
}

export const binanceClient = new BinanceClient();
