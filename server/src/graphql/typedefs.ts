import { GraphQLObjectType, GraphQLSchema } from "graphql";

export const typeDefs = `#graphql
  scalar JSON

  enum DateRange {
    one_hour,
    seven_days,
    twenty_four_hours,
    thirty_days
  }
  
  type Query {
    dexAggregator: [TokenInfo]
    dexAggregatorSpecific (symbol: String!, dateRange: DateRange):[TokenResponse]
  }

  type TokenResponse {
      date: Float
      price: Float
  }

  type TokenInfo {
    info: TokenDetails
    providers: [String]
    results: [TokenResult]
  }

  type TokenResult {
    price: Float
    provider: String
    price_change_percentage_24h: Float
    percent_change_7d: Float
    percent_change_1h: Float
    percent_change_24h: Float
  }
  type Quote{
    USD: QuoteDetails
  }
  type QuoteDetails{
    price: Float
    percent_change_1h: Float
    percent_change_7d: Float
    percent_change_24h: Float
    percent_change_30d: Float
    percent_change_60d: Float
    percent_change_90d: Float
  }
  type TokenDetails{
      id: String
      name: String
      symbol: String
      price_change_percentage_24h: Float
      current_price: Float
      image: String
      price_change_24h: Float
      quote: Quote
    }
`;

// export const schema = new GraphQLSchema({
//   description: "A schema for querying crypto data",
//   assumeValid: true,
//   query: new GraphQLObjectType({
//     name: "Query",
//     fields: {
//       dexAggregator: {
//         type: GraphQLJSON,
//         resolve: dexAggregator,
//       },
//       dexAggregatorSpecific: {
//         type: GraphQLJSON,
//         resolve: dexAggregatorSpecific,
//         args: {
//           symbol: { type: GraphQLString },
//           dateRange: { type: new GraphQLList(GraphQLString) },
//         },
//       },
//     },
//   }),
// });
