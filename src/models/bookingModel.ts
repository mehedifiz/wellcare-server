import { Schema, model, Document, Types } from "mongoose";

export interface IBooking extends Document {
  userId: Types.ObjectId;
  serviceId: Types.ObjectId;
  customerName: string;
  carModel: string;
  date: string;
  time: string;
  status: "Pending" | "Completed" | "Cancelled";
}

const bookingSchema = new Schema<IBooking>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    serviceId: { type: Schema.Types.ObjectId, ref: "Service", required: true },
    customerName: { type: String, required: true },
    carModel: { type: String, required: true },
    date: { type: String, required: true },
    time: { type: String, required: true },
    status: {
      type: String,
      enum: ["Pending", "Completed", "Cancelled"],
      default: "Pending",
    },
  },
  { timestamps: true }
);

export default model<IBooking>("Booking", bookingSchema);
