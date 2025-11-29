import express from "express";
import { auth } from "../middleware/auth";
import { createService, deleteService, getAllServices, getServiceById, updateService } from "../controllers/servicesController";

const seviceRoute = express.Router();

// Admin Routes (Protect with auth middleware if you want)
seviceRoute.post("/", auth("ADMIN") ,createService);
seviceRoute.get("/", auth() , getAllServices);


seviceRoute.get("/:id", auth() , getServiceById);

seviceRoute.put("/:id", auth("ADMIN"), updateService);
seviceRoute.delete("/:id", auth("ADMIN"), deleteService);
 

export default seviceRoute;
