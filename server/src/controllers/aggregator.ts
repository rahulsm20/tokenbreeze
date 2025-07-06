import { cmcClient } from "@/lib/cmc";
import { coingeckoClient } from "@/lib/coingecko";
import { logger } from "@/logger";
import { CMCResultType, DateRange } from "@/types";
import { PROVIDERS } from "@/utils/constants";

/**
 * Fetches historical data for a specific token from CoinGecko.
 * @param {Object} args - The arguments object.
 * @param {string} args.symbol - The symbol of the token.
 * @param {DateRange} args.dateRange - The date range for the historical data.
 */
export const dexAggregatorSpecific = async (
  _: any,
  {
    symbol,
    dateRange,
    currency,
  }: { symbol: string; dateRange: DateRange; currency: string }
) => {
  try {
    if (!symbol) {
      throw new Error("Please provide a valid symbol");
    }
    const listings = await coingeckoClient.getHistoricalData(
      symbol,
      dateRange,
      currency
    );
    const { prices = [] } = listings;
    const res = [];
    for (const price of prices) {
      res.push({
        date: new Date(price[0]),
        CoinGecko: Number(price[1].toFixed(4)),
      });
    }

    return res;
  } catch (err) {
    console.log(err);
    logger.error("Error in dexAggregatorSpecific", err);
    return err;
  }
};

/**
 * Fetches the latest listings from CoinMarketCap and CoinGecko, and combines them with Uniswap data.
 */
export async function dexAggregator(
  _: any,
  { currency = "usd" }: { currency: string }
) {
  try {
    const cmcListings = (await cmcClient.getLatestListings(
      currency
    )) as CMCResultType;

    const { data = [] } = cmcListings;

    let result = new Map();

    const CURRENCY = currency.toUpperCase();

    for (const listing of data) {
      const existing = result.get(listing.symbol) || [];
      result.set(listing.symbol, {
        info: { ...listing, symbol: listing.symbol.toUpperCase() },
        results: [
          ...(existing?.results || []),
          {
            provider: PROVIDERS.COIN_MARKET_CAP,
            price: listing.quote[CURRENCY].price,
            percent_change_7d: listing.quote[CURRENCY].percent_change_7d,
            percent_change_24h: listing.quote[CURRENCY].percent_change_24h,
            percent_change_1h: listing.quote[CURRENCY].percent_change_1h,
            total_supply: listing.total_supply,
          },
        ],
        providers: [PROVIDERS.COIN_MARKET_CAP],
      });
    }

    const cgData = await coingeckoClient.getLatestListings(currency);
    if (!cgData || cgData.length === 0) {
      logger.warn("No data found from CoinGecko");
      return Array.from(result.values());
    }
    for (const listing of cgData) {
      const symbol = listing.symbol.toUpperCase();
      const existing = result.get(symbol) || [];
      result.set(symbol, {
        info: {
          ...{ ...existing.info, ...listing },
          symbol,
        },
        results: [
          ...(existing?.results || []),
          {
            provider: PROVIDERS.COINGECKO,
            price: listing.current_price,
            market_cap: listing.market_cap,
            total_supply: listing.total_supply,
            total_volume: listing.total_volume,
            price_change_percentage_24h: listing.price_change_percentage_24h,
            sparkline_in_7d: listing.sparkline_in_7d.price || [],
          },
        ],
        providers: [...(existing?.providers || []), PROVIDERS.COINGECKO],
      });
    }

    // const USDC = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48";
    const res = Array.from(result.values());
    // for (const r of res) {
    //   const address = r.info?.platform?.token_address;
    //   if (address && address != USDC && ethers.isAddress(address)) {
    //     await oneInchAggregator(address, r);
    //   }
    // }
    return res;

    //     const price = ethers.formatUnits(
    //       parsedQuote.toAmount || parsedQuote.toTokenAmount,
    //       6
    //     );

    //     r.results.push({
    //       provider: PROVIDERS.ONEINCH,
    //       price,
    //     });
    //     r.providers.push(PROVIDERS.ONEINCH);
    //     continue;
    //   }

    //   const quote = await get1InchQuote(
    //     address,
    //     USDC,
    //     ethers.parseEther("1").toString()
    //   );

    //   if (quote) {
    //     await cacheData(cacheKey, JSON.stringify(quote), "5 mins");
    //     const price = ethers.formatUnits(
    //       quote.toAmount || quote.toTokenAmount,
    //       6
    //     );
    //     r.results.push({
    //       provider: PROVIDERS.ONEINCH,
    //       price,
    //     });
    //     r.providers.push(PROVIDERS.ONEINCH);
    //     await delay(500);
    //   }
    // }
  } catch (err) {
    console.error(err);
    return { err };
  }
}
