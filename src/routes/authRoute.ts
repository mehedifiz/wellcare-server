import express from "express";
import { login, register, verifyMail } from "../controllers/autcontroller";

const AuthRoute = express.Router();

AuthRoute.post("/register", register);
AuthRoute.post("/login", login);
AuthRoute.post("/verify-mail", verifyMail);

export default AuthRoute;
