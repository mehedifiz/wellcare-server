import mongoose, { Document } from "mongoose";

export interface IAppointment extends Document {
  patientId: mongoose.Types.ObjectId;
  doctorId: mongoose.Types.ObjectId;
  date: string;
  time: string;
  status: "pending" | "approved" | "cancelled" | "completed";
  paymentStatus: "unpaid" | "paid";
  paymentMethod: "cash" | "online";
  createdAt: Date;
}
