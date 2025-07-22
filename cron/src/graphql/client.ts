//----------------------------------------------------------------

import { config } from "config";
import dotenv from "dotenv";
import { GraphQLClient } from "graphql-request";
dotenv.config();

//----------------------------------------------------------------

console.log("Connecting to GraphQL server at:", config.SERVER_URL);
export const graphqlClient = new GraphQLClient(config.SERVER_URL, {
  method: "POST",
  headers: { "x-internal-job": config.ENCRYPTION_KEY },
});

//----------------------------------------------------------------
