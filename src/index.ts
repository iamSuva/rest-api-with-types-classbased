import "reflect-metadata";
import { App } from "./app";
import { AppDataSource } from "./database/data-source";
import dotenv from "dotenv";
import { connectRedis } from "./config/redis";
import { EmailWorker } from "./workers/email.worker";
dotenv.config();

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await AppDataSource.initialize();
    console.log("********** Database connected **********");

    await connectRedis();
    console.log("********** Redis connected **********");

    const emailWorker = new EmailWorker();
    console.log("********** Email worker started **********");

    const appInstance = new App();

    appInstance.app.listen(PORT, () => {
      console.log(`********** Server running on port ${PORT} **********`);
    });

  } catch (err) {
    console.error("********** Startup failed **********", err);
    process.exit(1);
  }
};

startServer();