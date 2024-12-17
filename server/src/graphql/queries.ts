import {
  dexAggregator,
  dexAggregatorSpecific,
} from "../controllers/aggregator";
import { dexListings } from "../controllers/dex-listings";

export const queries = {
  dexListings,
  dexAggregator,
  dexAggregatorSpecific,
};

export const DEX_AGGREGATOR = `
  query DexAggregator {
    dexAggregator
  }
`;

export const DEX_AGGREGATOR_SPECIFIC = `
  query DexAggregatorSpecific($symbol: String!, $dateRange: [String]) {
    dexAggregatorSpecific(symbol: $symbol, dateRange: $dateRange)
  }
`;
