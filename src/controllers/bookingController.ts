import { Request, Response } from "express";
import servicesModel from "../models/servicesModel";
import bookingModel from "../models/bookingModel";
import { sendEmail } from "../lib/sendMail";


export const createBooking = async (req: Request, res: Response) => {
  try {
    const { serviceId, customerName, carModel, date, time } = req.body;
    const userId = req.userId;

    // Validate inputs
    if (!serviceId || !customerName || !carModel || !date || !time) {
      return res.status(400).json({
        status: false,
        message: "All fields are required",
      });
    }

    // Check service exists
    const service = await servicesModel.findById(serviceId);
    if (!service) {
      return res.status(404).json({
        status: false,
        message: "Service not found",
      });
    }

    // Check if slot already booked
    const existingBooking = await bookingModel.findOne({
      serviceId,
      date,
      time,
      status: { $ne: "Cancelled" }, // cancelled ones don’t block the slot
    });

    if (existingBooking) {
      return res.status(409).json({
        status: false,
        message:
          "This time slot is already booked. Please choose another date or time.",
      });
    }

    // Create booking
    const newBooking = new bookingModel({
      userId,
      serviceId,
      customerName,
      carModel,
      date,
      time,
    });

    const savedBooking = await newBooking.save();

    return res.status(201).json({
      status: true,
      message: "Booking created successfully",
      data: savedBooking,
    });
  } catch (error) {
    console.error("Create Booking Error:", error);
    return res.status(500).json({
      status: false,
      message: "Internal server error",
    });
  }
};


// GET MY BOOKINGS WITH LIMIT & PAGINATION
export const getMyBookings = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;
    if (!userId) {
      return res.status(401).json({ status: false, message: "Unauthorized" });
    }

    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const total = await bookingModel.countDocuments({ userId });

    const bookings = await bookingModel
      .find({ userId })
      .populate("serviceId")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    return res.status(200).json({
      status: true,
      message: "Bookings fetched successfully",
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
      data: bookings,
    });
  } catch (error) {
    console.error("Get My Bookings Error:", error);
    return res.status(500).json({
      status: false,
      message: "Internal server error",
    });
  }
};


export const cancelBooking = async (req: Request, res: Response) => {
  try {
    const bookingId = req.params.id;
    const userId = req.userId;

    const booking = await bookingModel.findOne({ _id: bookingId, userId });

    if (!booking) {
      return res.status(404).json({
        status: false,
        message: "Booking not found",
      });
    }

    if (booking.status !== "Pending") {
      return res.status(400).json({
        status: false,
        message: "Only pending bookings can be cancelled",
      });
    }

    booking.status = "Cancelled";
    await booking.save();

    return res.status(200).json({
      status: true,
      message: "Booking cancelled successfully",
      data: booking,
    });
  } catch (error) {
    console.error("Cancel Booking Error:", error);
    return res.status(500).json({
      status: false,
      message: "Internal server error",
    });
  }
};



export const getAllBookings = async (req: Request, res: Response) => {
  try {
    const bookings = await bookingModel.find()
      .populate("userId", "name email")  
      .populate("serviceId", "title price"); 

    return res.status(200).json({ success: true, data: bookings });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

 
export const markBookingAsPaid = async (req: Request, res: Response) => {
  try {
    const { bookingId } = req.params;

    const booking = await bookingModel.findById(bookingId).populate(
      "userId",
      "name email"
    );
    if (!booking) {
      return res
        .status(404)
        .json({ success: false, message: "Booking not found" });
    }

    booking.status = "Completed"; // mark as paid/completed
    await booking.save();

    // send email to user
    const userEmail = (booking.userId as any).email;
    const userName = (booking.userId as any).name;

    const emailHtml = `
      <h2>Payment Successful</h2>
      <p>Hello ${userName},</p>
      <p>Your booking for ${booking.carModel} on ${booking.date} at ${booking.time} has been marked as <strong>Paid</strong>.</p>
      <p>Thank you for using our service!</p>
    `;

    await sendEmail({
      to: userEmail,
      subject: "Booking Payment Confirmation",
      html: emailHtml,
    });

    return res
      .status(200)
      .json({ success: true, message: "Booking marked as paid" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};