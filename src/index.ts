import "reflect-metadata";
import { App } from "./app";
import { AppDataSource } from "./database/data-source";
import dotenv from "dotenv";

dotenv.config();

const PORT = process.env.PORT || 5000;

AppDataSource.initialize()
  .then(() => {
    console.log("********** Database connected **********");
    const appInstance = new App();
    appInstance.app.listen(PORT, () => {
      console.log(`********** Server running on port ${PORT} **********`);
    });
  })
  .catch((err) => {
    console.error("********** Database connection failed **********", err);
  });