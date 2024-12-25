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

export const typeDefs = `#graphql
  scalar JSON

  enum DateRange {
    one_hour,
    seven_days,
    twenty_four_hours,
    thirty_days
  }

  type Query {
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
  description: "JSON data",
  serialize(value) {
    return value;
  },
  parseValue(value) {
    return value;
  },
  parseLiteral(ast) {
    switch (ast.kind) {
      case Kind.STRING:
      case Kind.BOOLEAN:
      case Kind.INT:
      case Kind.FLOAT:
        return ast.value;
      case Kind.OBJECT:
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
