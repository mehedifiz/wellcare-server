import bcrypt from "bcryptjs";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import userModel from "../models/userModel";
import tempUser from "../models/tempUser";
import { sendEmail } from "../lib/sendMail";

 

export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({ message: "Provide all fields" });
    }

    // Check in actual users
    const exist = await userModel.findOne({ email });
    if (exist) return res.status(400).json({ message: "User already exists" });

    // Hash password
    const hashed = await bcrypt.hash(password, 10);

    // Save to temp user
    const temp = await tempUser.create({ name, email, password: hashed });

    const secret = process.env.JWT_SECRET!;
    const token = jwt.sign({ tempId: temp._id, email }, secret, {
      expiresIn: "1h",
    });

    const verifyLink = `${process.env.CLIENT}/verify-mail?token=${token}`;
    console.log("verify" , verifyLink)
 const htmlContent = `
  <h2>Email Verification</h2>
  <p>Hello ${name},</p>
  <p>Click the button below to verify your account:</p>

  <a 
    href="${verifyLink}" 
    style="
      display:inline-block;
      padding:10px 20px;
      background-color:#4CAF50;
      color:white;
      text-decoration:none;
      border-radius:6px;
      font-weight:bold;
    "
  >
    Verify Email
  </a>

  <p>Or open this link manually:</p>
  <p>${verifyLink}</p>
`;


 await sendEmail({
   html: htmlContent,
   subject: "Verify Your Email",
   to: email,
 });

    res.status(200).json({
      message: "Verification mail sent!",
    });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};


// verify
export const verifyMail = async (req: Request, res: Response) => {
  try {
    const { token } = req.body;

    console.log("token" ,token)

    if (!token) {
      return res.status(400).json({ message: "Token missing" });
    }

    const secret = process.env.JWT_SECRET!;
    let decoded: any;
    console.log(secret ,"scrc")

    console.log(decoded, "decode");

    try {
      decoded = jwt.verify(token, secret);
    } catch (e) {
      console.log(e ,"e")
      return res.status(400).json({ message: "Invalid or expired token" });
    }
    console.log(decoded, "decode");

    const { tempId } = decoded;

    const temp = await tempUser.findById(tempId);
    if (!temp) {
      return res.status(400).json({ message: "Verification failed" });
    }

    // Move to real user collection
    const newUser = await userModel.create({
      name: temp.name,  
      email: temp.email, 
      password: temp.password, 
    });

    await tempUser.findByIdAndDelete(tempId);

    res.status(200).json({ success:true , message: "Email verified successfully!" });
  } catch (err: any) {
    res.status(500).json({success:false, message: "Server error", error: err.message });
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

    const token = jwt.sign({ id: user._id , role : user.role },  secret, { expiresIn: "7d" });

    res.cookie("token", token, {
      secure: true,
      httpOnly: true,
      sameSite: "none",
      maxAge: 1000 * 60 * 60,
    });

    console.log("Login successful, token set in cookie");

    res.status(200).json({ message : " loggedin successfully",
      user: { id: user._id, name: user.name, email: user.email , role: user.role },
      token,
    });
  } catch (error :any) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
