import { Router } from "express";
import { UserController } from "./user.controller";
import { AuthMiddleware } from "../../common/middlewares/auth.middleware";

export class UserRoutes {

  public router: Router;
  private userController: UserController;

  constructor() {
    this.router = Router();
    this.userController = new UserController();
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get("/all", this.userController.getAllUsers);
    this.router.post("/register", this.userController.register);
    this.router.post("/login", this.userController.login);
    this.router.patch("/update", AuthMiddleware.verifyToken, this.userController.updateUser);
    this.router.delete("/delete", AuthMiddleware.verifyToken, this.userController.deleteUser);
  }
}