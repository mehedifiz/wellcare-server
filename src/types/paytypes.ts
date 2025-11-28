import mongoose, { Document } from "mongoose";

export interface IPayment extends Document {
  appointmentId: mongoose.Types.ObjectId;
  amount: number;
  method: "cash" | "online";
  status: "success" | "failed";
  transactionId?: string;
  createdAt: Date;
}