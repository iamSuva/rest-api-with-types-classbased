import { AppDataSource } from "../database/data-source";
import { logger } from "../utils/logger";

export class Database {
  public static async connect(): Promise<void> {
    await AppDataSource.initialize();
    logger.info("Database connected");
  }

  public static async disconnect(): Promise<void> {
    await AppDataSource.destroy();
    logger.info("Database disconnected");
  }
}