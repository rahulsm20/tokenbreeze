import { get1InchQuote } from "@/lib/oneinch";
import { delay } from "@/utils";
import { PROVIDERS, USDC_ADDRESS } from "@/utils/constants";
import { cacheData, retrieveCachedData } from "@/utils/redis";
import { ethers } from "ethers";

export const oneInchAggregator = async (address: string, r: any) => {
  const cacheKey = `1inch_quote:${address}`;
  const cachedQuote = await retrieveCachedData(cacheKey);

  if (cachedQuote) {
    const quote = JSON.parse(cachedQuote);
    const price = ethers.formatUnits(quote.toAmount, 6);
    r.providers.push(PROVIDERS.ONEINCH);
    r.results.push({
      provider: PROVIDERS.ONEINCH,
      price,
    });
    return;
  }

  const quote = await get1InchQuote(
    address,
    USDC_ADDRESS,
    ethers.parseEther("1").toString()
  );

  if (quote && quote.toAmount) {
    await cacheData(cacheKey, JSON.stringify(quote), "5 mins");
    const price = ethers.formatUnits(quote.toAmount, 6);
    r.providers.push(PROVIDERS.ONEINCH);
    r.results.push({
      provider: PROVIDERS.ONEINCH,
      price,
    });
    await delay(500);
  }
};
