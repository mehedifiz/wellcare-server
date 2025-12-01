import express from "express";
 
import { auth } from "../middleware/auth";
import { createSslPayment, Payfailed, paymentSuccess } from "../controllers/payconntroller";
import { urlEncoderMiddleware } from "../middleware/payMIddleware";
 
const payRouter = express.Router();


payRouter.post(
  "/create-ssl-payment",
  
  auth("USER"),
  createSslPayment
);
payRouter.post("/success-payment", urlEncoderMiddleware, paymentSuccess);
payRouter.post("/failed", urlEncoderMiddleware , Payfailed); 
 


export default payRouter;
