import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import AuthRoute from "./routes/authRoute";
import seviceRoute from "./routes/servicesRoute";
import bookingRouter from "./routes/bookingRoute";
import payRouter from "./routes/paymentRoute";
import userRoute from "./routes/userrRoute";
import statRoute from "./routes/statRoute";
import Messrouter from "./routes/contractRoute";


dotenv.config();

export const app: express.Application = express();

app.use(cors());
app.use(express.json());



// Routes
app.use("/api/auth", AuthRoute);
app.use("/api/service", seviceRoute);

app.use("/api/booking", bookingRouter);

app.use("/api/pay", payRouter);
app.use("/api/user", userRoute);


app.use("/api/stat", statRoute);
app.use("/api/message", Messrouter);
