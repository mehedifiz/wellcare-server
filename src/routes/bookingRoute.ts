import express from "express";
 
import { auth } from "../middleware/auth";
import { cancelBooking, createBooking, getAllBookings, getMyBookings, markBookingAsPaid } from "../controllers/bookingController";

const bookingRouter = express.Router();

// Admin Routes (Protect with auth middleware if you want)
bookingRouter.post("/", auth("USER"), createBooking);
bookingRouter.get("/my-booking", auth("USER"), getMyBookings);


bookingRouter.put("/cancel/:id", auth("USER", "ADMIN"), cancelBooking);


bookingRouter.get("/get-all", auth("ADMIN"), getAllBookings);


bookingRouter.patch(
  "/paid/:bookingId/",
  auth("ADMIN"),
  markBookingAsPaid
);



export default bookingRouter;
