// A schema is a collection of type definitions (hence "typeDefs")
// that together define the "shape" of queries that are executed against
// your data.
export const typeDefs = `#graphql
  type Book {
    title: String
    author: String
  }

  type User {
    id: ID
    name: String
    email: String
    password: String
    createdAt: String
    updatedAt: String
  }

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

  type Query {
    users: [User]
    crypto (ticker: String, startDate: String, endDate: String): CryptoResponse
  }

  type TokenResponse {
    message: String
    token: String
  }

`;
