import {
  GraphQLEnumType,
  GraphQLFloat,
  GraphQLList,
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLString,
} from "graphql";
import {
  dexAggregator,
  dexAggregatorSpecific,
} from "../controllers/aggregator";

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
    price: { type: GraphQLFloat },
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
  },
});

const QuoteDetailsType = new GraphQLObjectType({
  name: "QuoteDetails",
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

const QuoteType = new GraphQLObjectType({
  name: "Quote",
  fields: {
    USD: { type: QuoteDetailsType },
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

const QueryType = new GraphQLObjectType({
  name: "Query",
  fields: {
    dexAggregator: {
      type: new GraphQLList(TokenInfoType),
      resolve: dexAggregator,
    },
    dexAggregatorSpecific: {
      type: new GraphQLList(TokenResponseType),
      args: {
        symbol: { type: GraphQLString },
        dateRange: { type: DateRangeType },
      },
      resolve: dexAggregatorSpecific,
    },
  },
});

export const schema = new GraphQLSchema({
  query: QueryType,
});
