import { Schema, model, Document } from "mongoose";

export interface IService extends Document {
  title: string;
  price: number;
  duration: string;
  description: string;
  createdAt: Date;
}

const serviceSchema = new Schema<IService>(
  {
    title: { type: String, required: true },
    price: { type: Number, required: true },
    duration: { type: String, required: true },
    description: { type: String, required: true },
  },
  { timestamps: true }
);

export default model<IService>("Service", serviceSchema);
