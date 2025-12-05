import { Request, Response } from "express";
import userModel from "../models/userModel";
import bookingModel from "../models/bookingModel";
import mongoose from "mongoose";

export const getAdminDashboardStats = async (req: Request, res: Response) => {
  try {
   
    const totalUsers = await userModel.countDocuments();

  
    const totalBookings = await bookingModel.countDocuments();

   
    const pendingBookings = await bookingModel.countDocuments({
      status: "Pending",
    });

 
    const completedBookings = await bookingModel.countDocuments({
      status: "Completed",
    });

  
    const cancelledBookings = await bookingModel.countDocuments({
      status: "Cancelled",
    });

    return res.status(200).json({
      status: true,
      message: "Admin dashboard stats fetched successfully",
      data: {
        totalUsers,
        totalBookings,
        pendingBookings,
        completedBookings,
        cancelledBookings,
      },
    });
  } catch (error) {
    console.error("Admin Dashboard Stats Error:", error);
    return res.status(500).json({
      status: false,
      message: "Internal server error",
    });
  }
};


 

export const getTopServices = async (req: Request, res: Response) => {
  try {
    const topServices = await bookingModel.aggregate([
      { $match: { status: { $ne: "Cancelled" } } }, // Only active bookings
      { $group: { _id: "$serviceId", totalBookings: { $sum: 1 } } },
      { $sort: { totalBookings: -1 } },
      { $limit: 3 },
      {
        $lookup: {
          from: "services",
          localField: "_id",
          foreignField: "_id",
          as: "service",
        },
      },
      { $unwind: "$service" },
      {
        $project: {
          _id: "$service._id",
          title: "$service.title",
          price: "$service.price",
          duration: "$service.duration",
          totalBookings: 1,
        },
      },
    ]);

    return res.status(200).json({
      status: true,
      message: "Top services fetched successfully",
      data: topServices,
    });
  } catch (error) {
    console.error("Top Services Error:", error);
    return res.status(500).json({
      status: false,
      message: "Internal server error",
    });
  }
};

 

export const getMyBookingStats = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;
 

    const stats = await bookingModel.aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(userId) } },
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          completed: {
            $sum: { $cond: [{ $eq: ["$status", "Completed"] }, 1, 0] },
          },
          pending: { $sum: { $cond: [{ $eq: ["$status", "Pending"] }, 1, 0] } },
          cancelled: {
            $sum: { $cond: [{ $eq: ["$status", "Cancelled"] }, 1, 0] },
          },
        },
      },
    ]);

    const statsData = stats[0] || {
      total: 0,
      completed: 0,
      pending: 0,
      cancelled: 0,
    };

    const pendingBookings = await bookingModel
      .find({ userId, status: "Pending" })
      .populate("serviceId")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      status: true,
      message: "Booking stats fetched successfully",
      data: {
        stats: statsData,
        pendingBookings,
      },
    });
  } catch (error) {
    console.error("Booking Stats Error:", error);
    return res.status(500).json({
      status: false,
      message: "Internal server error",
      error: (error as Error).message,
    });
  }
};

