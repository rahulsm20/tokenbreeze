import { getQuoteFromUniswap } from "../lib/uniswap";
import { CMCResultType, DateRange } from "../../types";
import { cmcClient } from "../lib/cmc";
import { coingeckoClient } from "../lib/coingecko";
import { logger } from "../logger";
import { PROVIDERS } from "../utils/constants";

export const dexAggregatorSpecific = async (
  _: any,
  { symbol, dateRange }: { symbol: string; dateRange: DateRange }
) => {
  try {
    if (!symbol) {
      throw new Error("Please provide a valid symbol");
    }
    const listings = await coingeckoClient.getHistoricalData(symbol, dateRange);
    const { prices } = listings;
    const res = [];
    for (const price of prices) {
      res.push({
        date: new Date(price[0]),
        price: Number(price[1].toFixed(4)),
      });
    }
    return res;
  } catch (err) {
    // console.log(err);
    return err;
  }
};

export const dexAggregator = async (
  _: any,
  { dateRange }: { dateRange: string[] }
) => {
  try {
    logger.info("Aggregating data from multiple sources");
    const cmcListings = (await cmcClient.getLatestListings()) as CMCResultType;
    const { data } = cmcListings;
    let result = new Map();

    for (const listing of data) {
      const existing = result.get(listing.symbol) || [];
      result.set(listing.symbol, {
        info: { ...listing, symbol: listing.symbol.toUpperCase() },
        results: [
          ...(existing?.results || []),
          {
            provider: PROVIDERS.COIN_MARKET_CAP,
            price: listing.quote.USD.price,
            percent_change_7d: listing.quote.USD.percent_change_7d,
            percent_change_24h: listing.quote.USD.percent_change_24h,
            percent_change_1h: listing.quote.USD.percent_change_1h,
          },
        ],
        providers: [PROVIDERS.COIN_MARKET_CAP],
      });
    }

    const cgData = await coingeckoClient.getLatestListings();

    for (const listing of cgData) {
      const existing = result.get(listing.symbol.toUpperCase()) || [];
      result.set(listing.symbol.toUpperCase(), {
        info: {
          ...{ ...existing.info, ...listing },
          symbol: listing.symbol.toUpperCase(),
        },
        results: [
          ...(existing?.results || []),
          {
            provider: PROVIDERS.COINGECKO,
            price: listing.current_price,
            price_change_percentage_24h: listing.price_change_percentage_24h,
          },
        ],
        providers: [...(existing?.providers || []), PROVIDERS.COINGECKO],
      });
    }

    const res = Array.from(result.values());
    // for (const r of res) {
    //   const address = r.info?.platform?.token_address;
    //   const id = r.info?.id;
    //   if (address) {
    //     const quote = await getQuoteFromUniswap({ id, address });
    //     if (quote) {
    //       r.results.push({
    //         provider: PROVIDERS.UNISWAP,
    //         price: quote,
    //       });
    //       r.providers.push(PROVIDERS.UNISWAP);
    //     }
    //   }
    // }
    return res;
  } catch (err) {
    console.log(err);
    return { err };
  }
};
