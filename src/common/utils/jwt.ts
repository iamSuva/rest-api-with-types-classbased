import jwt from "jsonwebtoken";
import { JwtPayload } from "../../interface/auth";

export class JwtUtil {

  static generateToken(payload: JwtPayload): string {
    const secret = process.env.JWT_SECRET;
    if (!secret) throw new Error("JWT_SECRET is not set");
    const options = {
      expiresIn: process.env.JWT_EXPIRES_IN ?? "1d",
    } as jwt.SignOptions;
    return jwt.sign(payload, secret, options);
  }
}