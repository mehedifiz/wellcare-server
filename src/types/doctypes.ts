import mongoose from "mongoose";

export interface IDoctor extends Document {
  userId: mongoose.Types.ObjectId;
  image?: string;
  specialization: string;
  desciption?: string;

  experience: number;
  fees: number;
  availableSlots: string[];

  earnings: number;
  createdAt: Date;
}