import { createClient } from "redis";

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

export const cacheData = async (key: string, data: string) => {
  await connectRedis();
  const cached = await redisClient.set(key, data);
  return cached;
};

export const retrieveCachedData = async (key: string) => {
  await connectRedis();
  const cached = await redisClient.get(key);
  return cached;
};
