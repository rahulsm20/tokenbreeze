//-----------------------------------------------------------------

import { graphqlClient } from "@/graphql/client";
import { DEX_AGGREGATOR_SPECIFIC } from "@/graphql/queries";
import { buildDexAggregatorQuery, delay } from "@/utils";

//----------------------------------------------------------------

const RATE_LIMIT = 5; // per minute
const INTERVAL = Math.ceil(60000 / RATE_LIMIT); // delay between requests

//-----------------------------------------------------------------

export async function cacheController(currency: string) {
  try {
    const query = buildDexAggregatorQuery(currency);
    const data = (await graphqlClient.request(query, { currency })) as any;

    if (!data) {
      console.error(`❌ No data returned for currency: ${currency}`);
    }
    console.log(`✅ Fetched historical data for currency: ${currency}`);

    // Limit to top 10 popular tokens
    const historicalTokens = data?.dexAggregator
      ? data?.dexAggregator.slice(0, 10)
      : [];

    for (const token of historicalTokens) {
      if (!token.info) {
        console.warn(`⚠️ No info found for token: ${token.symbol}`);
        continue;
      }

      await graphqlClient.request(DEX_AGGREGATOR_SPECIFIC, {
        id: token.info?.id,
        symbol: token.info?.symbol,
        dateRange: "twenty_four_hours",
        currency,
      });

      await delay(INTERVAL);
    }

    return true;
  } catch (err: any) {
    console.error("❌ GraphQL Error:", JSON.stringify(err, null, 2));
    return null;
  }
}

//-----------------------------------------------------------------
