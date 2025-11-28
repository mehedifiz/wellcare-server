import mongoose, { Schema , Model } from "mongoose";
import { IPayment } from "../types/paytypes";



const paymentSchema = new Schema<IPayment>(
  {
    appointmentId: { type: Schema.Types.ObjectId, ref: "Appointment", required: true },

    amount: { type: Number, required: true },

    method: {
      type: String,
      enum: ["cash", "online"],
      default: "cash",
    },

    status: {
      type: String,
      enum: ["success", "failed"],
      default: "success",
    },

    transactionId: { type: String },
    
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export const Payment: Model<IPayment> =
  mongoose.models.Payment ||
  mongoose.model<IPayment>("Payment", paymentSchema);
