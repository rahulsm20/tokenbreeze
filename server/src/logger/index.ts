import fs from "fs";
import path from "path";
import winston from "winston";

const { combine, timestamp, json } = winston.format;

const logDir = path.resolve("logs");
const transports: winston.transport[] = [];

if (process.env.NODE_ENV === "production") {
  transports.push(new winston.transports.Console());
} else {
  if (!fs.existsSync(logDir)) fs.mkdirSync(logDir, { recursive: true });

  transports.push(
    new winston.transports.File({
      filename: path.join(logDir, "combined.log"),
    }),
    new winston.transports.File({
      filename: path.join(logDir, "app-error.log"),
      level: "error",
    })
  );
}

export const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || "info",
  format: combine(timestamp(), json()),
  transports,
});
