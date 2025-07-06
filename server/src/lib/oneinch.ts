//-----------------------------------------------------------

import { config } from "@/config";
import axios from "axios";

//-----------------------------------------------------------

export const get1InchQuote = async (
  fromToken: string,
  toToken: string,
  amount: string
) => {
  const url = `https://api.1inch.dev/swap/v5.2/1/quote?fromTokenAddress=${fromToken}&toTokenAddress=${toToken}&amount=${amount}`;
  const headers = {
    Authorization: `Bearer ${config.ONEINCH_API_KEY}`,
  };
  try {
    const { data } = await axios.get(url, { headers });
    return data;
  } catch (err) {
    if (axios.isAxiosError(err)) {
      console.error("1inch quote failed", err?.response?.data || err);
    }
    return null;
  }
};
