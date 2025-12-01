import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import AuthRoute from "./routes/authRoute";
import seviceRoute from "./routes/servicesRoute";
import bookingRouter from "./routes/bookingRoute";
import payRouter from "./routes/paymentRoute";


dotenv.config();

export const app: express.Application = express();

app.use(cors());
app.use(express.json());



// Routes
app.use("/api/auth", AuthRoute);
app.use("/api/service", seviceRoute);

app.use("/api/booking", bookingRouter);

app.use("/api/pay", payRouter);
