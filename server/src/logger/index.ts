import winston from "winston";
const { combine, timestamp, json } = winston.format;

export const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || "info",
  format: combine(timestamp(), json()),
  transports: [
    new winston.transports.File({
      filename: "combined.log",
    }),
    new winston.transports.File({
      filename: "app-error.log",
      level: "error",
    }),
    new winston.transports.Http({
      host: process.env.HOST || "localhost",
      port: parseInt(process.env.PORT || "0") || 5601,
      auth: {
        username: process.env.ELASTICSEARCH_USERNAME,
        password: process.env.ELASTICSEARCH_PASSWORD,
      },
    }),
  ],
});

logger.on("error", (error) => {
  console.error("Error in logger caught", error);
});

logger.on("close", () => {
  console.log("Logger closed");
});
