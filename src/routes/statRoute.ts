import express from "express";
import { auth } from "../middleware/auth";
import { getAdminDashboardStats, getMyBookingStats, getTopServices } from "../controllers/statController";

const statRoute = express.Router();

statRoute.get("/admin" , auth("ADMIN") , getAdminDashboardStats)
statRoute.get("/top-services", auth("ADMIN"), getTopServices);

statRoute.get("/my/stats", auth("USER"), getMyBookingStats);

 


 

export default statRoute;