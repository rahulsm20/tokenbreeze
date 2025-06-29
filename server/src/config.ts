import dotenv from "dotenv";
dotenv.config();

export const config = {
  // The base URL for the API requests
  API_BASE_URL: process.env.API_BASE_URL || "http://localhost:3000",
  ONEINCH_API_KEY: process.env.ONEINCH_API_KEY || "",
};
