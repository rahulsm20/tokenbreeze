import { dexAggregator, dexAggregatorSpecific } from "@/controllers/aggregator";
import { quote } from "@/controllers/web3";
import {
  GraphQLEnumType,
  GraphQLFloat,
  GraphQLList,
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLString,
} from "graphql";

export const typeDefs = `#graphql

  scalar JSON

  enum DateRange {
    one_hour,
    seven_days,
    twenty_four_hours,
    thirty_days
  }

  type Query {
    dexAggregator(currency: String!): [TokenInfo]
    dexAggregatorSpecific (symbol: String!, dateRange: DateRange, currency: String!):[TokenResponse]
    quote (tokenOne: String, tokenTwo: String, tokenOneAmount: String, address: String): QuoteDetails
  }

  type TokenResponse {
      date: Float
      CoinGecko: Float
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
    total_supply: Float
    market_cap: Float
    total_volume: Float
    sparkline_in_7d: [Float]
  }
  
  type Quote {
    USD: QuoteDetails
    GBP: QuoteDetails
    EUR: QuoteDetails
    INR: QuoteDetails
  }

  type QuoteDetails {
    price: Float
    percent_change_1h: Float
    percent_change_7d: Float
    percent_change_24h: Float
    percent_change_30d: Float
    percent_change_60d: Float
    percent_change_90d: Float
  }

  type TokenDetails {
      id: String
      name: String
      symbol: String
      price_change_percentage_24h: Float
      current_price: Float
      image: String
      price_change_24h: Float
      quote: Quote
  }

  type HistoricalChartDataPreview {
    date: Float
    price: Float
  }
`;

const DateRangeType = new GraphQLEnumType({
  name: "DateRange",
  values: {
    one_hour: { value: "one_hour" },
    seven_days: { value: "seven_days" },
    twenty_four_hours: { value: "twenty_four_hours" },
    thirty_days: { value: "thirty_days" },
  },
});

const TokenResponseType = new GraphQLObjectType({
  name: "TokenResponse",
  fields: {
    date: { type: GraphQLFloat },
    CoinGecko: { type: GraphQLFloat },
  },
});

const TokenResultType = new GraphQLObjectType({
  name: "TokenResult",
  fields: {
    price: { type: GraphQLFloat },
    provider: { type: GraphQLString },
    price_change_percentage_24h: { type: GraphQLFloat },
    percent_change_7d: { type: GraphQLFloat },
    percent_change_1h: { type: GraphQLFloat },
    percent_change_24h: { type: GraphQLFloat },
    total_supply: { type: GraphQLFloat },
    market_cap: { type: GraphQLFloat },
    total_volume: { type: GraphQLFloat },
    sparkline_in_7d: {
      type: new GraphQLList(GraphQLFloat),
    },
  },
});

const QuoteType = new GraphQLObjectType({
  name: "Quote",
  fields: {
    price: { type: GraphQLFloat },
    percent_change_1h: { type: GraphQLFloat },
    percent_change_7d: { type: GraphQLFloat },
    percent_change_24h: { type: GraphQLFloat },
    percent_change_30d: { type: GraphQLFloat },
    percent_change_60d: { type: GraphQLFloat },
    percent_change_90d: { type: GraphQLFloat },
  },
});

const TokenDetailsType = new GraphQLObjectType({
  name: "TokenDetails",
  fields: {
    id: { type: GraphQLString },
    name: { type: GraphQLString },
    symbol: { type: GraphQLString },
    price_change_percentage_24h: { type: GraphQLFloat },
    current_price: { type: GraphQLFloat },
    image: { type: GraphQLString },
    price_change_24h: { type: GraphQLFloat },
    quote: { type: QuoteType },
  },
});

const TokenInfoType = new GraphQLObjectType({
  name: "TokenInfo",
  fields: {
    info: { type: TokenDetailsType },
    providers: { type: new GraphQLList(GraphQLString) },
    results: { type: new GraphQLList(TokenResultType) },
  },
});

const QuoteDetailsType = new GraphQLObjectType({
  name: "QuoteDetails",
  fields: {
    transaction: { type: GraphQLString },
    price: { type: GraphQLFloat },
  },
});

const QueryType = new GraphQLObjectType({
  name: "Query",
  fields: {
    dexAggregator: {
      args: {
        currency: { type: GraphQLString },
      },
      type: new GraphQLList(TokenInfoType),
      resolve: dexAggregator,
    },
    dexAggregatorSpecific: {
      type: new GraphQLList(TokenResponseType),
      args: {
        symbol: { type: GraphQLString },
        dateRange: { type: DateRangeType },
        currency: { type: GraphQLString },
      },
      resolve: dexAggregatorSpecific,
    },
    quote: {
      type: QuoteDetailsType,
      args: {
        symbol: { type: GraphQLString },
        dateRange: { type: DateRangeType },
        currency: { type: GraphQLString },
      },
      resolve: quote,
    },
  },
});

const HistoricalChartDataPreview = new GraphQLObjectType({
  name: "HistoricalChartDataPreview",
  fields: {
    date: { type: GraphQLFloat },
    price: { type: GraphQLFloat },
  },
});

export const schema = new GraphQLSchema({
  query: QueryType,
});
