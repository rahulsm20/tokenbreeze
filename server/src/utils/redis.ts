import dotenv from "dotenv";
import { createClient } from "redis";
dotenv.config();

export const redisClient = createClient({
  url: process.env.REDIS_URL,
});

redisClient.on("connect", () => console.log("Connected to Redis"));
redisClient.on("disconnect", () => console.log("Disconnected from Redis"));
redisClient.on("error", function (error) {
  console.error(error);
});

const connectRedis = async () => {
  if (!redisClient.isOpen) {
    await redisClient.connect();
  }
};

export const disconnectRedis = async () => {
  if (redisClient.isOpen) {
    await redisClient.disconnect();
  }
};

/**
 * Function to cache data in Redis
 * @param key
 * @param data
 * @param lifetime
 * @returns Promise<string>
 */
export const cacheData = async (
  key: string,
  data: string,
  lifetime?: "5 mins" | "1 day" | "1 minute"
) => {
  await connectRedis();
  const cached = await redisClient.set(key, data, {
    EX:
      lifetime == "5 mins" || !lifetime
        ? 60 * 5
        : lifetime == "1 minute"
        ? 60 * 1
        : 60 * 60 * 24, // default to 1 day
  });
  return cached;
};

export const retrieveCachedData = async (key: string) => {
  await connectRedis();
  const cached = await redisClient.get(key);
  return cached;
};
