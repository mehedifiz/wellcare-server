import { Request, Response } from "express";
import userModel from "../models/userModel";
import bookingModel from "../models/bookingModel";

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
