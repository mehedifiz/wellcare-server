import express from "express";
import { auth } from "../middleware/auth";
import { sendMessage } from "../controllers/messageController";
 
const Messrouter = express.Router();

Messrouter.post("/send", sendMessage);

export default Messrouter;
