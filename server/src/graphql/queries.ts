//--------------------------------------------

import { dexAggregator, dexAggregatorSpecific } from "@/controllers/aggregator";
import { quote } from "@/controllers/web3";

//--------------------------------------------

export const queries = {
  dexAggregator,
  dexAggregatorSpecific,
  quote,
};

const fragments = {
  tokenInfo: `
    fragment tokenInfo on TokenInfo {
      info {
      id
      name
      symbol
      price_change_percentage_24h
      current_price
      image
      price_change_24h
      quote {
          price
          percent_change_1h
          percent_change_7d
          percent_change_24h
          percent_change_30d
          percent_change_60d
          percent_change_90d
        }
      }
      providers
      results {
        price
        provider
        price_change_percentage_24h
        percent_change_7d
        percent_change_1h
        percent_change_24h
        total_supply
        market_cap
        total_volume
      }
    }
  `,
  tokenResponse: `
    fragment tokenResponse on TokenResponse {
      date
      CoinGecko
    }
  `,
};

export const DEX_AGGREGATOR = `
  query DexAggregator(currency: String!) {
    dexAggregator(currency: $currency) {
      ...tokenInfo
    }
  }
  ${fragments.tokenInfo}
`;

export const DEX_AGGREGATOR_SPECIFIC = `
  query DexAggregatorSpecific($symbol: String!, $dateRange: DateRange, $currency: String!) {
    dexAggregatorSpecific(symbol: $symbol, dateRange: $dateRange, currency: $currency) {
      date
      CoinGecko
    }
  }
`;

export const SWAP_QUOTE = `
  query Quote(tokenOne: String, tokenTwo: String, tokenOneAmount: String, address: String) {
    quote(tokenOne: $tokenOne, tokenTwo: $tokenTwo, tokenOneAmount: $tokenOneAmount, address: $address) {
      price
    }
  }
`;
