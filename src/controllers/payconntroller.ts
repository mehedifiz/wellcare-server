import SSLCommerzPayment from "sslcommerz-lts";
import { Request, Response } from "express";
import bookingModel from "../models/bookingModel";
import userModel from "../models/userModel";
import { Types } from "mongoose";

// 1️⃣ Create SSLCommerz Payment Session
export const createSslPayment = async (req: Request, res: Response) => {
  try {
    const { bookingId } = req.body;

    if (!bookingId) {
      return res
        .status(400)
        .json({ success: false, message: "Booking ID is required" });
    }

    const booking = await bookingModel
      .findById(bookingId)
      .populate("userId")
      .populate("serviceId");
    if (!booking) {
      return res
        .status(404)
        .json({ success: false, message: "Booking not found" });
    }

    const user = booking.userId as any;
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    const service = booking.serviceId as any;

    // SSLCommerz config
    const sslcz = new SSLCommerzPayment(
      process.env.STORE_ID!,
      process.env.STORE_PASSWORD!,
      false
    );

    // Payment data
    const tranId = new Types.ObjectId().toString();
    const data = {
      total_amount: service.price.toString(), // now works
      product_name: service.title,
      currency: "BDT",
      tran_id: tranId,
      success_url: `${process.env.SERVER_URL}/api/pay/success-payment`,
      fail_url: `${process.env.CLIENT}/payment/failed`,
      cancel_url: `${process.env.CLIENT}/payment/cancel`,
      ipn_url: `${process.env.SERVER_URL}/api/pay/ipn`,
      shipping_method: "NO",

      product_category: "Service",
      product_profile: "non-physical-goods",
      cus_name: user.name,
      cus_email: user.email,
      cus_phone: "01756217997",
      cus_add1: "Bangladesh",
      cus_city: "Bangladesh",
      cus_country: "Bangladesh",
      value_a: user._id.toString(),
      value_b: booking._id.toString(), // bookingId
      value_c: "", // optional for extra info
    };

    // Initialize payment
    const paymentSession = await sslcz.init(data);

    if (!paymentSession?.GatewayPageURL) {
      return res
        .status(400)
        .json({ success: false, message: "Payment session creation failed" });
    }

    return res.status(200).json({
      success: true,
      message: "Payment session created",
      data: { paymentUrl: paymentSession.GatewayPageURL, tranId },
    });
  } catch (error: any) {
    console.error("Payment initiation error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to initiate payment",
      error: error.message,
    });
  }
};

 
export const paymentSuccess = async (req: Request, res: Response) => {
 
  try {
    const {
      val_id,
      tran_id,
      amount,
      value_a, // userId
      value_b, // bookingId
      value_c,
    } = req.body;
   

    if (!value_b) {
      return res.redirect(
        `${process.env.CLIENT}/payment/failed?reason=no_booking`
      );
    }

    const bookingId = value_b;

    const sslcz = new SSLCommerzPayment(
      process.env.STORE_ID!,
      process.env.STORE_PASSWORD!,
      false
    );

    

    // Validate transaction
    const validationData = await sslcz.validate({ val_id: val_id.toString() });

    if (!validationData || validationData.status !== "VALID") {
      return res.redirect(
        `${process.env.CLIENT}/payment/failed?reason=validation_failed`
      );
    }

   
    const booking = await bookingModel.findByIdAndUpdate(
      bookingId,
      { status: "Completed" },
      { new: true }
    );

    if (!booking) {
      return res.redirect(
        `${process.env.CLIENT}/payment/failed?reason=booking_not_found`
      );
    }
 
    return res.redirect(`${process.env.CLIENT}/dashboard`);
  } catch (error) {
    console.error("Payment success handler error:", error);
    return res.redirect(
      `${process.env.CLIENT}/payment/failed?reason=server_error`
    );
  }
};

export const Payfailed = async (req: Request, res: Response) => {
  console.log(req.body);

  return res.redirect(
    `${process.env.API_URL}/payment/failed?reason=server_error`
  );
};
