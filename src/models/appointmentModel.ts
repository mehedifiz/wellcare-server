import mongoose, { Schema, Model } from "mongoose";
import { IAppointment } from "../types/appoinmentsType";


const appointmentSchema = new Schema<IAppointment>(
  {
    patientId: { type: Schema.Types.ObjectId, ref: "User", required: true },

    doctorId: { type: Schema.Types.ObjectId, ref: "Doctor", required: true },

    date: { type: String, required: true },

    time: { type: String, required: true },

    status: {
      type: String,
      enum: ["pending", "approved", "cancelled", "completed"],
      default: "pending",
    },

    paymentStatus: {
      type: String,
      enum: ["unpaid", "paid"],
      default: "unpaid",
    },

    paymentMethod: {
      type: String,
      enum: ["cash", "online"],
      default: "cash",
    },

    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export const Appointment: Model<IAppointment> =
  mongoose.models.Appointment ||
  mongoose.model<IAppointment>("Appointment", appointmentSchema);
