import dotenv from "dotenv";

dotenv.config();

export const config = {
  SERVER_URL: process.env.SERVER_URL || "http://localhost:4000/api/v1/graphql",
  ENCRYPTION_KEY: process.env.ENCRYPTION_KEY || "your-encryption-key",
  SUBSCRIPTION_TOPIC:
    process.env.SUBSCRIPTION_TOPIC || "your-subscription-topic",
};
