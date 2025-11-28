import { Document } from "mongoose";

export interface IUser extends Document {
  name: string;
  image?: string;
  email: string;
  password: string;
  role: "patient" | "doctor" | "admin";
  createdAt: Date;
}
