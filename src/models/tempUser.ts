import { Schema, model, Document } from "mongoose";

export interface ITempUser extends Document {
  name: string;
  email: string;
  password: string;
  createdAt: Date;
}

const tempUserSchema = new Schema<ITempUser>({
  name: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now, expires: "15m" },
});

export default model<ITempUser>("TempUser", tempUserSchema);
