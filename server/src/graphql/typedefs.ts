// A schema is a collection of type definitions (hence "typeDefs")
// that together define the "shape" of queries that are executed against

import {
  GraphQLList,
  GraphQLObjectType,
  GraphQLScalarType,
  GraphQLSchema,
  GraphQLString,
  Kind,
} from "graphql";
import {
  dexAggregator,
  dexAggregatorSpecific,
} from "../controllers/aggregator";

// your data.
export const typeDefs = `#graphql
  
  type HistoryLog {
    id: ID
    symbol: String
    value: Float
    date: String
    createdAt: String
    updatedAt: String
    }

  type Value {
    value: Float
    date: String
  }

  type CryptoResponse {
    ticker: String
    provider: String
    results: [Value]
  }

  scalar JSON

  enum DateRange {
    one_hour,
    seven_days,
    twenty_four_hours,
    thirty_days
  }

  type Query {
    dexListings (ticker: String): [CryptoResponse]
    dexAggregator: JSON!
    dexAggregatorSpecific (symbol: String!, dateRange: DateRange): JSON!
  }

  type TokenResponse {
    message: String
    token: String
  }

`;

const GraphQLJSON = new GraphQLScalarType({
  name: "JSON",
  description: "Arbitrary JSON data",
  serialize(value) {
    return value; // The value is already JSON
  },
  parseValue(value) {
    return value;
  },
  parseLiteral(ast) {
    // This method is used for parsing literal values in GraphQL queries
    // For JSON, this can be complex to fully implement
    switch (ast.kind) {
      case Kind.STRING:
      case Kind.BOOLEAN:
      case Kind.INT:
      case Kind.FLOAT:
        return ast.value;
      case Kind.OBJECT:
        // Parse object literals if needed
        return ast;
      default:
        return null;
    }
  },
});

export const schema = new GraphQLSchema({
  description: "A schema for querying crypto data",
  assumeValid: true,
  query: new GraphQLObjectType({
    name: "Query",
    fields: {
      dexAggregator: {
        type: GraphQLJSON,
        resolve: dexAggregator,
      },
      dexAggregatorSpecific: {
        type: GraphQLJSON,
        resolve: dexAggregatorSpecific,
        args: {
          symbol: { type: GraphQLString },
          dateRange: { type: new GraphQLList(GraphQLString) },
        },
      },
    },
  }),
});
