import { AppDataSource } from "../database/data-source";

export class Database {
  public static async connect(): Promise<void> {
    await AppDataSource.initialize();
    console.log("✅ Database connected");
  }

  public static async disconnect(): Promise<void> {
    await AppDataSource.destroy();
    console.log("Database disconnected");
  }
}