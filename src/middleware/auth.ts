import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import userModel, { IUser } from "../models/userModel";

// Extend Request to include user
export interface AuthRequest extends Request {
  user?: IUser;
}

export const auth = (...roles: string[]) => {
  return async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      let token: string | undefined;

      // 1. Check Authorization header
      if (req.headers.authorization?.startsWith("Bearer ")) {
        token = req.headers.authorization.split(" ")[1];
      }
      // 2. Or check cookie
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

      // Attach user to request
      const user = await userModel.findById(decoded.id);
      if (!user) return res.status(401).json({ message: "User not found" });

      req.user = user;

      console.log("token " , token , "role" , user?.role) 

      // Check roles if provided
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
