import { Request, Response } from "express";
import UserModel from "../models/userModel";
import BookingModel from "../models/bookingModel";
import { sendEmail } from "../lib/sendMail";

export const getAllUsersWithStats = async (req: Request, res: Response) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const totalUsers = await UserModel.countDocuments();

    const users = await UserModel.find()
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    // If no users
    if (users.length === 0) {
      return res.status(200).json({
        status: true,
        message: "No users found",
        users: [],
      });
    }

    const bookingStats = await BookingModel.aggregate([
      {
        $group: {
          _id: "$userId",
          total: { $sum: 1 },
          completed: {
            $sum: { $cond: [{ $eq: ["$status", "Completed"] }, 1, 0] },
          },
          pending: {
            $sum: { $cond: [{ $eq: ["$status", "Pending"] }, 1, 0] },
          },
          cancelled: {
            $sum: { $cond: [{ $eq: ["$status", "Cancelled"] }, 1, 0] },
          },
        },
      },
    ]);

    const statsMap: any = {};
    bookingStats.forEach((stat) => {
      statsMap[stat._id.toString()] = stat;
    });

    const finalUsers = users.map((user) => {
      const stats = statsMap[user._id.toString()] || {
        total: 0,
        completed: 0,
        pending: 0,
        cancelled: 0,
      };

      return {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        
        bookingStats: stats,
      };
    });

    return res.status(200).json({
      status: true,
      message: "Users fetched successfully",
      page,
      limit,
      totalUsers,
      users: finalUsers,
    });
  } catch (error) {
    console.error("Get All Users Error:", error);
    return res.status(500).json({
      status: false,
      message: "Internal server error",
    });
  }
};


export const sendMail = async (req: Request, res: Response) => {
  try {
    const { to, subject, html } = req.body;

    // Basic validation
    if (!to || !subject || !html) {
      return res.status(400).json({
        status: false,
        message: "to, subject and html fields are required",
      });
    }

    // Call your email service
    await sendEmail({ to, subject, html });

    res.status(200).json({
      status: true,
      message: "Email sent successfully",
    });
  } catch (error) {
    console.error("Email error:", error);
    res.status(500).json({
      status: false,
      message: "Failed to send email",
      error: error instanceof Error ? error.message : error,
    });
  }
};