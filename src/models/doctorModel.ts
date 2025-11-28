import mongoose, { Schema, Model } from "mongoose";
import { IDoctor } from "../types/doctypes";

const doctorSchema = new Schema<IDoctor>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    image: { type: String },
    specialization: { type: String, required: true },
    desciption: { type: String },

    experience: { type: Number, default: 0 },

    fees: { type: Number, required: true },

    availableSlots: { type: [String], default: [] },

    earnings: { type: Number, default: 0 },

    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export const Doctor: Model<IDoctor> =
  mongoose.models.Doctor || mongoose.model<IDoctor>("Doctor", doctorSchema);
