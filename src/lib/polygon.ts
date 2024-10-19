import { restClient } from "@polygon.io/client-js";
import dotenv from "dotenv";
dotenv.config();
export const polygonClient = restClient(process.env.POLYGON_API_KEY);
