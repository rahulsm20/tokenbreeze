//--------------------------------------------

import {
  dexAggregator,
  dexAggregatorSpecific,
  searchDexAggregator,
} from "@/controllers/aggregator";
import { quote } from "@/controllers/web3";

//--------------------------------------------

export const queries = {
  dexAggregator,
  dexAggregatorSpecific,
  quote,
  searchDexAggregator,
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
        sparkline_in_7d
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
  query DexAggregator($currency: String!) {
    dexAggregator(currency: $currency) {
      ...tokenInfo
    }
  }
  ${fragments.tokenInfo}
`;

export const DEX_AGGREGATOR_SPECIFIC = `
  query DexAggregatorSpecific($id:String!, $symbol: String!, $dateRange: DateRange, $currency: String!) {
    dexAggregatorSpecific(id: $id, symbol: $symbol, dateRange: $dateRange, currency: $currency) {
      date
      CoinGecko
      Coinbase
      Binance
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

export const SEARCH_AGGREGATOR = `
  query SearchAggregator($query: String!, $currency: String, $page: Int) {
    searchDexAggregator(query: $query, currency: $currency, page: $page) {
      ...tokenInfo
    }
  }
  ${fragments.tokenInfo}
`;
