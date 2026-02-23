import { NextFunction ,Request, Response} from "express";
import { AppError } from "../errors/AppError";
import jwt from "jsonwebtoken";
import { JwtPayload } from "../../interface/auth";

export interface AuthRequest extends Request {
    user:{
        id: string;
    }
}



export class AuthMiddleware {

  static verifyToken(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return next(new AppError("Unauthorized", 401));
    }

    const token = authHeader.split(" ")[1];

    try {
      const decoded = jwt.verify(
        token as string,
        process.env.JWT_SECRET! as string
      ) as JwtPayload;

      (req as AuthRequest).user = { id: decoded.id };

      next();
    } catch (error) {
      return next(new AppError("Invalid or expired token", 401));
    }
  }
}