import dayjs from "dayjs";
import { polygonClient } from "../lib/polygon";
import { prisma } from "../prisma/client";
import { cacheData, retrieveCachedData } from "../utils/redis";
import { API_SOURCES, DEX_SOURCES } from "../utils/constants";

export const resolvers = {
  Query: {
    users: async () => {
      const users = await prisma.user.findMany({});
      return users;
    },
    crypto: async (
      _: any,
      {
        ticker,
        startDate,
        endDate,
      }: { ticker: string; startDate: string; endDate: string }
    ) => {
      if (!startDate) {
        throw new Error("Invalid start date");
      }
      if (!endDate) {
        throw new Error("Invalid end date");
      }

      let provider = API_SOURCES.POLYGON;
      const start = dayjs(startDate).format("YYYY-MM-DD");
      const end = dayjs(endDate).format("YYYY-MM-DD");

      const cacheKey = `${ticker}:${start}:${end}`;
      const cachedData = await retrieveCachedData(cacheKey);

      if (cachedData) {
        return JSON.parse(cachedData);
      }

      const crypto = await polygonClient.crypto.aggregates(
        ticker,
        1,
        "month",
        start,
        end
      );
      if (crypto.resultsCount === 0) {
        throw new Error("No results found");
      }

      const results = crypto.results?.map((result) => {
        return {
          value: result.v,
          date: result.t,
        };
      });

      await cacheData(cacheKey, JSON.stringify({ ticker, provider, results }));
      return { ticker, provider, results };
    },
  },
};
