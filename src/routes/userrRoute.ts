import express from "express";
import { auth } from "../middleware/auth";
import { getAllUsersWithStats, sendMail } from "../controllers/userController";

const userRoute = express.Router();


userRoute.get("/", auth("ADMIN"), getAllUsersWithStats);


userRoute.post("/mail", auth("ADMIN"), sendMail);


 

export default userRoute;
