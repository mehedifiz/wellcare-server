import { Request, Response } from "express";
import contactModel from "../models/contactModel";


 

export const sendMessage = async (req: Request, res: Response) => {
  try {
    const { name, email, phone, message } = req.body;

    if (!name || !email || !phone || !message) {
      return res.status(400).json({ error: "All fields are required" });
    }

    await contactModel.create({
      name,
      email,
      phone,
      message,
    
    });

    return res.status(201).json({success:true , message: "Message sent successfully" });
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
};
