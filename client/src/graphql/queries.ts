import { gql } from "@apollo/client";

export const DEX_AGGREGATOR = gql`
  query DexAggregator {
    dexAggregator
  }
`;

export const DEX_AGGREGATOR_SPECIFIC = gql`
  query DexAggregatorSpecific($symbol: String!, $dateRange: DateRange) {
    dexAggregatorSpecific(symbol: $symbol, dateRange: $dateRange)
  }
`;
