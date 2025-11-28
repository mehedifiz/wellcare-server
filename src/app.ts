import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import AuthRoute from "./routes/authRoute";


dotenv.config();

export const app: express.Application = express();

app.use(cors());
app.use(express.json());



// Routes
app.use("/api/auth", AuthRoute);
