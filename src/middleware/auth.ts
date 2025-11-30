import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import userModel, { IUser } from "../models/userModel";
import {   Types } from "mongoose";

// Extend Request
export interface AuthRequest extends Request {
  user?: IUser;
  userId?: Types.ObjectId;
}

export const auth = (...roles: string[]) => {
  return async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      let token: string | undefined;

      // 1. From Authorization header
      if (req.headers.authorization?.startsWith("Bearer ")) {
        token = req.headers.authorization.split(" ")[1];
      }
      // 2. From cookie
      else if (req.cookies?.token) {
        token = req.cookies.token;
      }

      if (!token) {
        return res
          .status(401)
          .json({ message: "Unauthorized: No token provided" });
      }

      const secret = process.env.JWT_SECRET!;
      let decoded: any;

      try {
        decoded = jwt.verify(token, secret);
      } catch (err) {
        return res
          .status(401)
          .json({ message: "Unauthorized: Invalid or expired token" });
      }

      // Save userId to req
      req.userId = decoded.id;

      // Attach user object
      const user = await userModel.findById(decoded.id);
      if (!user) return res.status(401).json({ message: "User not found" });

      req.user = user;

      console.log("token:", token, "role:", user.role, "userId:", req.userId);

      // Role check
      if (roles.length > 0 && !roles.includes(user.role)) {
        return res
          .status(403)
          .json({ message: "Forbidden: You do not have access" });
      }

      next();
    } catch (err: any) {
      res.status(500).json({ message: "Server error", error: err.message });
    }
  };
};
