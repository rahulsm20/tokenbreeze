import { binanceClient } from "@/lib/binance";
import { coinbaseClient } from "@/lib/coinbase";
import { coingeckoClient } from "@/lib/coingecko";
import { logger } from "@/logger";
import { DateRange, DexAggregatorSpecificType } from "@/types";
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
    id,
    symbol,
    dateRange,
    currency,
  }: { id: string; symbol: string; dateRange: DateRange; currency: string }
) => {
  try {
    if (!symbol) {
      throw new Error("Please provide a valid symbol");
    }
    const normalizeDate = (ts: number, dateRange: DateRange) => {
      const d = new Date(ts);
      switch (dateRange) {
        case DateRange.thirty_days:
          d.setUTCHours(0, 0, 0, 0);
          break;
      }
      return d.getTime();
    };

    // const listings = await coingeckoClient.getHistoricalData(
    //   id,
    //   dateRange,
    //   currency
    // );
    // const { prices = [] } = listings;
    const resMap = new Map<number, DexAggregatorSpecificType>();

    // for (const price of prices) {
    //   const date = normalizeDate(price[0], dateRange);
    //   resMap.set(date, {
    //     ...(resMap.get(date) || { date }),
    //     CoinGecko: Number(price[1].toFixed(4)),
    //   });
    // }

    if (binanceClient) {
      const binanceData = await binanceClient.getHistoricalData(
        symbol,
        dateRange,
        currency
      );
      if (binanceData) {
        for (const price of binanceData) {
          const date = normalizeDate(price[0], dateRange);
          const close = Number(parseFloat(price[4] || "0").toFixed(4));
          resMap.set(date, {
            ...(resMap.get(date) || { date }),
            Binance: close,
          });
        }
      }
    }
    const coinbaseData = await coinbaseClient.getHistoricalData(
      symbol,
      dateRange,
      currency
    );
    if (coinbaseData) {
      for (const entry of coinbaseData) {
        const date = normalizeDate(entry[0] * 1000, dateRange);
        const close = Number(parseFloat(entry[4] || "0").toFixed(4));
        resMap.set(date, {
          ...(resMap.get(date) || { date }),
          Coinbase: close,
        });
      }
    }

    const res = Array.from(resMap.values()).sort((a, b) => a.date - b.date);
    return res;
  } catch (err) {
    console.log(err);
    logger.error("Error in dexAggregatorSpecific", err);
    return err;
  }
};

//--------------------------------------------

/**
 * Fetches the latest listings from CoinMarketCap and CoinGecko, and combines them with Uniswap data.
 */
export async function dexAggregator(
  _: any,
  { currency = "usd", page }: { currency: string; page: number }
) {
  try {
    // const cmcListings = (await cmcClient.getLatestListings(
    //   currency,
    //   page,
    //   20
    // )) as CMCResultType;
    // const { data = [] } = cmcListings;

    let result = new Map();

    // const CURRENCY = currency.toUpperCase();

    // for (const listing of data) {
    //   const existing = result.get(listing.symbol) || [];
    //   result.set(listing.symbol, {
    //     info: { ...listing, symbol: listing.symbol.toUpperCase() },
    //     results: [
    //       ...(existing?.results || []),
    //       {
    //         provider: PROVIDERS.COIN_MARKET_CAP,
    //         price: listing.quote[CURRENCY].price,
    //         percent_change_7d: listing.quote[CURRENCY].percent_change_7d,
    //         percent_change_24h: listing.quote[CURRENCY].percent_change_24h,
    //         percent_change_1h: listing.quote[CURRENCY].percent_change_1h,
    //         total_supply: listing.total_supply,
    //       },
    //     ],
    //     providers: [PROVIDERS.COIN_MARKET_CAP],
    //   });
    // }

    const cgData = await coingeckoClient.getLatestListings(currency, page, 10);

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
            percent_change_7d:
              ((listing.sparkline_in_7d.price[
                listing.sparkline_in_7d.price.length - 1
              ] -
                listing.sparkline_in_7d.price[0]) /
                listing.sparkline_in_7d.price[0]) *
              100,
          },
        ],
        providers: [...(existing?.providers || []), PROVIDERS.COINGECKO],
      });
    }

    const USDC = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48";
    const res = Array.from(result.values());

    // for (const r of res) {
    //   const address = r.info?.platform?.token_address;
    //   if (address && address != USDC && ethers.isAddress(address)) {
    //     const token = { id: r.info?.id, address };
    //     const price = await getQuoteFromUniswap(token);
    //     if (price) {
    //       r.results.push({
    //         provider: PROVIDERS.UNISWAP,
    //         price,
    //       });
    //     }
    //   } else {
    //     console.warn(`Invalid address for token ${r.info?.symbol}: ${address}`);
    //   }
    // }
    // for (const r of res) {
    //   const address  = r.info?.platform?.token_address;
    //   if (address && address != USDC && ethers.isAddress(address)) {
    //     await oneInchAggregator(address, r);
    //   }
    // }
    for (const r of res) {
      const symbol = r.info?.symbol.toUpperCase();
      const coinbaseData = await coinbaseClient.getPrice(symbol, currency);
      if (coinbaseData && coinbaseData.data && coinbaseData.data.amount) {
        r.results.push({
          provider: PROVIDERS.COINBASE,
          price: coinbaseData.data.amount,
        });
        r.providers.push(PROVIDERS.COINBASE);
      }
    }

    for (const r of res) {
      const symbol = r.info?.symbol.toUpperCase();
      if (symbol == "USDT") continue; // Skip USDT as Binance uses USDT for USD
      const binanceData = await binanceClient.getPrice(symbol, currency);
      if (binanceData && binanceData.symbol) {
        r.results.push({
          provider: PROVIDERS.BINANCE,
          price: binanceData.price,
        });
        r.providers.push(PROVIDERS.BINANCE);
      }
    }

    return res;
  } catch (err) {
    console.error(err);
    return { err };
  }
}

//--------------------------------------------

export async function searchDexAggregator(
  _: any,
  {
    query,
    currency = "usd",
    page,
  }: { query: string; currency: string; page: number }
) {
  try {
    const cgData = await coingeckoClient.searchListings(query, currency, page);
    if (!cgData || cgData.length === 0) {
      logger.warn("No data found from CoinGecko");
      return [];
    }
    const { coins = [] } = cgData;

    if (coins.length === 0) {
      logger.warn("No coins found in search results");
      return [];
    }

    let result = new Map();

    const marketData = await coingeckoClient.getLatestListings(
      currency,
      page,
      10,
      coins.map((coin: { id: string }) => coin.id)
    );
    if (!marketData || marketData.length === 0) {
      logger.warn("No market data found from CoinGecko");
      return [];
    }
    for (const listing of marketData) {
      const symbol = listing.symbol.toUpperCase();

      const existing = result.get(symbol);

      result.set(symbol, {
        info: {
          ...(existing ? { ...existing.info, ...listing } : { ...listing }),
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
    const res = Array.from(result.values());

    for (const r of res) {
      const symbol = r.info?.symbol.toUpperCase();
      const coinbaseData = await coinbaseClient.getPrice(symbol, currency);
      if (coinbaseData && coinbaseData.data && coinbaseData.data.amount) {
        r.results.push({
          provider: PROVIDERS.COINBASE,
          price: coinbaseData.data.amount,
        });
        r.providers.push(PROVIDERS.COINBASE);
      }
    }

    for (const r of res) {
      const symbol = r.info?.symbol.toUpperCase();
      if (symbol == "USDT") continue; // Skip USDT as Binance uses USDT for USD
      const binanceData = await binanceClient.getPrice(symbol, currency);
      if (binanceData && binanceData.symbol) {
        r.results.push({
          provider: PROVIDERS.BINANCE,
          price: binanceData.price,
        });
        r.providers.push(PROVIDERS.BINANCE);
      }
    }

    return Array.from(result.values());
  } catch (err) {
    console.error(err);
    return { err };
  }
}
