import { gql } from "graphql-request";

export function buildDexAggregatorQuery(currency: string) {
  return gql`
    query DexAggregator($currency: String!) {
      dexAggregator(currency: $currency) {
        info {
          id
          name
          symbol
          price_change_percentage_24h
          current_price
          image
          price_change_24h
          quote {
            ${currency.toUpperCase()} {
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
    }
  `;
}

export const delay = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));
