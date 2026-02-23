import "reflect-metadata";
import { DataSource } from "typeorm";
import { envConfig } from "../config/env.config";
import { User } from "../modules/user/user.entity";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: envConfig.DB_HOST,
  port: envConfig.DB_PORT,
  username: envConfig.DB_USERNAME,
  password: envConfig.DB_PASSWORD,
  database: envConfig.DB_NAME,
  entities: [User],
  synchronize: true,
  logging: false,
});