import { config } from "@/config";
import { cacheData, retrieveCachedData } from "@/utils/redis";
import { NextFunction, Request, Response } from "express";
import ip from "ip";

export const rateLimiter = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (req.headers["x-internal-job"] == config.ENCRYPTION_KEY) {
    return next();
  }
  const address = ip.address();
  const cacheKey = `ip:${address}`;
  const data = await retrieveCachedData(cacheKey);
  if (data) {
    if (parseInt(data) > 5) {
      return res.status(400).json("Rate limited");
    } else {
      const rate = parseInt(data) + 1;
      await cacheData(cacheKey, rate.toString(), "1 minute");
    }
  } else {
    await cacheData(cacheKey, "0", "1 minute");
  }
  next();
};
