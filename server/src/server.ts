import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { ApolloServerPluginLandingPageDisabled } from "@apollo/server/plugin/disabled";
import cors from "cors";
import dotenv from "dotenv";
import express, { Request, Response } from "express";
import { resolvers } from "./graphql/resolvers";
import { typeDefs } from "./graphql/typedefs";
import { rateLimiter } from "./middleware/rate-limit";
dotenv.config();
const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", async (_req: Request, res: Response) => {
  return res
    .status(200)
    .json({ message: "tokenbreeze service running", status: "ok" });
});

const startServer = async () => {
  const plugins = [];
  if (process.env.NODE_ENV === "production") {
    plugins.push(ApolloServerPluginLandingPageDisabled());
  }
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    plugins,
  });
  await server.start();

  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use("/api/v1/graphql", rateLimiter, expressMiddleware(server));
  app.use("*", async (_req: Request, res: Response) => {
    return res.status(404).json({ error: "Invalid route" });
  });

  app.listen(port, () => {
    console.log(`>> GraphQL server on :${port}/api/v1/graphql`);
  });
};

startServer();
