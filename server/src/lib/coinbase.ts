import { Coinbase } from "@coinbase/coinbase-sdk";
import { API_KEY } from "../utils/constants";

class CoinbaseClient {
  client: Coinbase;
  constructor() {
    this.client = new Coinbase({
      apiKeyName: API_KEY.COINBASE,
      privateKey: process.env.COINBASE_PRIVATE_KEY || "",
    });
  }
}

export const coinbaseClient = new CoinbaseClient();
