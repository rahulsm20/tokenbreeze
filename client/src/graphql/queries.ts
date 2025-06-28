import { gql } from "@apollo/client";

const fragments = {
  tokenInfo: gql`
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
          USD {
            price
            percent_change_1h
            percent_change_7d
            percent_change_24h
            percent_change_30d
            percent_change_60d
            percent_change_90d
          }
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
  tokenResponse: gql`
    fragment TokenResponse on TokenResponse {
      date
      CoinGecko
    }
  `,
};

export const DEX_AGGREGATOR = gql`
  query DexAggregator {
    dexAggregator {
      ...TokenInfo
    }
  }
  ${fragments.tokenInfo}
`;

export const DEX_AGGREGATOR_SPECIFIC = gql`
  query DexAggregatorSpecific(
    $symbol: String!
    $dateRange: DateRange
    $currency: String!
  ) {
    dexAggregatorSpecific(
      symbol: $symbol
      dateRange: $dateRange
      currency: $currency
    ) {
      date
      CoinGecko
    }
  }
`;

export const SWAP_QUOTE = gql`
  query Quote(
    $tokenOne: String
    $tokenTwo: String
    $tokenOneAmount: String
    $address: String
  ) {
    quote(
      tokenOne: $tokenOne
      tokenTwo: $tokenTwo
      tokenOneAmount: $tokenOneAmount
      address: $address
    ) {
      price
    }
  }
`;
