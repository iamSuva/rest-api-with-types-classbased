import "reflect-metadata";
import dotenv from "dotenv";
dotenv.config();
import { App } from "./app";
import { AppDataSource } from "./database/data-source";
import { connectRedis } from "./config/redis";
import { EmailWorker } from "./workers/email.worker";
import { logger } from "./utils/logger";

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await AppDataSource.initialize();
    const runMigrations = await AppDataSource.runMigrations();
    if (runMigrations.length > 0) {
      logger.info(`Ran ${runMigrations.length} migration(s): ${runMigrations.map((m) => m.name).join(", ")}`);
    }
    logger.info("********** Database connected **********");

    await connectRedis();
    logger.info("********** Redis connected **********");

    const emailWorker = new EmailWorker();
    logger.info("********** Email worker started **********");

    const appInstance = new App();

    appInstance.app.listen(PORT, () => {
      logger.info(`********** Server running on port ${PORT} **********`);
    });

  } catch (err) {
    logger.error(`********** Startup failed **********\n ${err}`);
    process.exit(1);
  }
};

startServer();