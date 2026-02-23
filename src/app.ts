import express from "express";
import { UserRoutes } from "./modules/user/user.route";
import { errorHandler } from "./common/middlewares/error.middleware";

export class App {

  public app = express();

  constructor() {
    this.initializeMiddlewares();
    this.initializeRoutes();
    this.initializeErrorHandling();
  }

  private initializeMiddlewares() {
    this.app.use(express.json());
  }

  private initializeRoutes() {
    const userRoutes = new UserRoutes();
    this.app.use("/api/users", userRoutes.router);
  }

  private initializeErrorHandling() {
    this.app.use(errorHandler);
  }
}