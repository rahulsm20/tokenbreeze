import fs from "fs";
import path from "path";
import winston from "winston";

const { combine, timestamp, json } = winston.format;

const logDir = path.resolve("logs");
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

export const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || "info",
  format: combine(timestamp(), json()),
  transports: [
    new winston.transports.File({
      filename: path.join(logDir, "combined.log"),
    }),
    new winston.transports.File({
      filename: path.join(logDir, "app-error.log"),
      level: "error",
    }),
    // You can still keep the HTTP transport commented for now
  ],
});

logger.on("error", (error) => {
  console.error("Error in logger caught", error);
});

logger.on("close", () => {
  console.log("Logger closed");
});
