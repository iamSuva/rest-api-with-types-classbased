import { Request, Response, NextFunction } from "express";
import { UserService } from "./user.service";
import { registerSchema, loginSchema, updateUserSchema  } from "./user.schema";
import { ApiResponse } from "../../common/utils/response";
import { AuthRequest } from "../../common/middlewares/auth.middleware";
import { redisClient } from "../../config/redis";
import { emailQueue } from "../../queues/email.queue";
export class UserController {

  private userService = new UserService();

  getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 10;
      // using redis cache to fetch users
      const cacheKey = `users:page:${page}:limit:${limit}`;
      const cachedData = await redisClient.get(cacheKey);
      if (cachedData) {
        console.log("Users fetched successfully from cache");
        return ApiResponse.success(res, JSON.parse(cachedData), "Users fetched successfully from cache", 200);
      }
      // if not found in cache, fetch from database
      const result = await this.userService.getAllUsers(page, limit);
      console.log("********** Users fetched successfully from database **********");
      // set cache
      await redisClient.setEx(cacheKey, 120, JSON.stringify(result));
      console.log("********** Cache set successfully **********");
      return ApiResponse.success(res, result, "Users fetched successfully", 200);
    } catch (error) {
      next(error);
    }
  };
  register = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const validatedData = registerSchema.parse(req.body);
      const result = await this.userService.register(validatedData);

      // add job to email queue
      await emailQueue.add("welcomeEmail",
        { email: result.email, name: result.email.split("@")[0] },
        {
          delay:5000,
          attempts:3,
          backoff:{
            type:"exponential",
            delay:1000,
          },
        }
      );
      console.log("********** Job added to email queue **********");
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