import { createClient } from "redis";
import { logger } from "../utils/logger";
export const redisClient = createClient({
  url: "redis://localhost:6379",
});

redisClient.on("error", (err) => {
  logger.error(`Redis Error: ${err}`);
});

export const connectRedis = async () => {
  if (!redisClient.isOpen) {
    await redisClient.connect();
    logger.info("Redis connected successfully");
  }
};