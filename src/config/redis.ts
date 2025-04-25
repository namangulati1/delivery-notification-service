import { createClient } from "redis";
import logger from "../utils/logger";

const redisClient = createClient({
  url: process.env.REDIS_URL || "redis://localhost:6379",
  legacyMode: true,
});

redisClient.on("error", (err) => {
  logger.error("Redis Client Error", err);
});

const initRedis = async (): Promise<void> => {
  try {
    await redisClient.connect();
    logger.info("Redis client connected successfully");
  } catch (error) {
    logger.error("Redis client connection error:", error);
    process.exit(1);
  }
}

export { redisClient, initRedis };