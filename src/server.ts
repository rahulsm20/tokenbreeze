import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { ApolloServerPluginLandingPageDisabled } from "@apollo/server/plugin/disabled";
import cors from "cors";
import dotenv from "dotenv";
import express, { Request, Response } from "express";
import { resolvers } from "./graphql/resolvers";
import { typeDefs } from "./graphql/typedefs";
import { cmcClient } from "./lib/cmc";
import authRoutes from "./routes/auth";

dotenv.config();
const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", async (req: Request, res: Response) => {
  return res
    .status(200)
    .json({ message: "DEXter service running", status: "ok" });
});

app.use("/auth", authRoutes);
app.get("/listings", async (req: Request, res: Response) => {
  const listings = await cmcClient.getLatestListings();
  return res.status(200).json(listings);
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
  app.use("/graphql", expressMiddleware(server));
  app.use("*", async (req: Request, res: Response) => {
    return res.status(404).json({ error: "Invalid route" });
  });

  app.listen(port, () => {
    console.log(`>> REST server on :${port}`);
    console.log(`>> GraphQL server on :${port}/graphql`);
  });
};

startServer();
