import bcrypt from "bcryptjs";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import userModel from "../models/userModel";

// REGISTER
export const register = async (req :Request, res :Response) => {
  try {
    const { name, email, password } = req.body;

     if (!email || !password || !name) {
       return res
         .status(400)
         .json({ message: "Please provide email and password" });
     }

    // Check if user exists
    const existingUser = await userModel.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "User already exists" });

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const newUser = await userModel.create({
      name,
      email,
      password: hashedPassword,
    });

   const secret = process.env.JWT_SECRET;
   if (!secret) {
     return res
       .status(500)
       .json({ message: "JWT secret is not set in environment" });
   }

   // Then use secret
   const token = jwt.sign({ id: newUser._id }, secret, { expiresIn: "7d" });


    res.status(201).json({ message :"Registerd" , user: { id: newUser._id, name, email }, token });
  } catch (error  :any) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// LOGIN
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: "Please provide email and password" });
    }
      // Find user
      const user = await userModel.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    const secret = process.env.JWT_SECRET;
    if (!secret) {
      return res
        .status(500)
        .json({ message: "JWT secret is not set in environment" });
    }

    const token = jwt.sign({ id: user._id }, secret, { expiresIn: "7d" });

    res.cookie("token", token, {
      secure: true,
      httpOnly: true,
      sameSite: "none",
      maxAge: 1000 * 60 * 60,
    });

    console.log("Login successful, token set in cookie");

    res.status(200).json({ message : " loggedin successfully",
      user: { id: user._id, name: user.name, email: user.email },
      token,
    });
  } catch (error :any) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
