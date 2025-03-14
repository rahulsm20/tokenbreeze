import {
  dexAggregator,
  dexAggregatorSpecific,
} from "../controllers/aggregator";

export const queries = {
  dexAggregator,
  dexAggregatorSpecific,
};

const fragments = {
  tokenInfo: `
    fragment TokenInfo on TokenInfo {
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
      }
    }
  `,
  tokenResponse: `
    fragment TokenResponse on TokenResponse {
      date
      price
    }
  `,
};
export const DEX_AGGREGATOR = `
  query DexAggregator {
    dexAggregator{
    ...TokenInfo
  }
  }
  ${fragments.tokenInfo}
`;

export const DEX_AGGREGATOR_SPECIFIC = `
  query DexAggregatorSpecific($symbol: String!, $dateRange: [String]) {
    dexAggregatorSpecific(symbol: $symbol, dateRange: $dateRange){
      date
      price
    }
  }
`;
