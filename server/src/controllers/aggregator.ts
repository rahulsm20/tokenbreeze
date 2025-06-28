import { CMCResultType, DateRange } from "../../types";
import { cmcClient } from "../lib/cmc";
import { coingeckoClient } from "../lib/coingecko";
import { logger } from "../logger";
import { PROVIDERS } from "../utils/constants";

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
 * @param {any} _ - Unused parameter.
 * @param {Object} args - The arguments object.
 * @param {string[]} args.dateRange - The date range for the historical data.
 * @returns {Promise<any>} - The combined listings data.
 */
export const dexAggregator = async (
  _: any,
  { dateRange }: { dateRange: string[] }
) => {
  try {
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
            total_supply: listing.total_supply,
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
            market_cap: listing.market_cap,
            total_supply: listing.total_supply,
            total_volume: listing.total_volume,
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
