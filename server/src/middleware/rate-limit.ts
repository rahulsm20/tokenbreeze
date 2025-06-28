import { NextFunction, Request, Response } from "express";
import ip from "ip";
import { cacheData, retrieveCachedData } from "../utils/redis";

export const rateLimiter = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
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
