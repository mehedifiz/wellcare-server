import { Schema, model, Document } from "mongoose";

export interface IContactMessage extends Document {
  name: string;
  email: string;
  phone: string;
  message: string;
  userId?: string; 
}

const contactMessageSchema = new Schema<IContactMessage>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    message: { type: String, required: true },
    userId: { type: String }, // store user for filtering
  },
  { timestamps: true }
);

export default model<IContactMessage>("ContactMessage", contactMessageSchema);
