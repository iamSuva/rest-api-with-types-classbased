import { Request, Response, NextFunction } from "express";
import { UserService } from "./user.service";
import { registerSchema, loginSchema, updateUserSchema  } from "./user.schema";
import { ApiResponse } from "../../common/utils/response";
import { AuthRequest } from "../../common/middlewares/auth.middleware";

export class UserController {

  private userService = new UserService();

  getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 10;
      const result = await this.userService.getAllUsers(page, limit);
      return ApiResponse.success(res, result, "Users fetched successfully", 200);
    } catch (error) {
      next(error);
    }
  };
  register = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const validatedData = registerSchema.parse(req.body);
      const result = await this.userService.register(validatedData);
      return ApiResponse.success(res, result, "User registered successfully", 201);
    } catch (error) {
      next(error);
    }
  };

  login = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const validatedData = loginSchema.parse(req.body);
      const result = await this.userService.login(validatedData);
      return ApiResponse.success(res, result, "Login successful", 200);
    } catch (error) {
      next(error);
    }
  };

  updateUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const validatedData = updateUserSchema.parse(req.body);
      console.log(validatedData);
      const userId = (req as AuthRequest).user.id;
      const result = await this.userService.updateUser(validatedData, userId);
      return ApiResponse.success(res, result, "User updated successfully", 200);
    } catch (error) {
      next(error);
    }
  };

  deleteUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = (req as AuthRequest).user.id;
      await this.userService.deleteUser(userId);
      return ApiResponse.success(res, { id: userId }, "User deleted successfully", 200);
    } catch (error) {
      next(error);
    }
  };
}