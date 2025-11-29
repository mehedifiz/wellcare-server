import { Request, Response } from "express";
import servicesModel from "../models/servicesModel";

// ================== CREATE SERVICE ==================
export const createService = async (req: Request, res: Response) => {
  try {
    const { title, price, duration, description } = req.body;

    if (!title || !price || !duration || !description) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newService = new servicesModel({ title, price, duration, description });
    const savedService = await newService.save();

    res.status(201).json({ success: true, message: " Service Created!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

// ================== GET ALL SERVICES ==================
export const getAllServices = async (req: Request, res: Response) => {
  try {
    const services = await servicesModel.find().sort({ createdAt: -1 });
    res.status(200).json(services);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

// ================== GET SINGLE SERVICE ==================
export const getServiceById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const service = await servicesModel.findById(id);

    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }

    res.status(200).json(service);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

export const updateService = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { title, price, duration, description } = req.body;

    const updatedService = await servicesModel.findByIdAndUpdate(
      id,
      { title, price, duration, description },
      { new: true } // return the updated document
    );

    if (!updatedService) {
      return res.status(404).json({ message: "Service not found" });
    }

    res.status(200).json({ success: true, updatedService , message :"Updated"});
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

export const deleteService = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const deletedService = await servicesModel.findByIdAndDelete(id);

    if (!deletedService) {
      return res.status(404).json({ message: "Service not found" });
    }

    res.status(200).json({ success : true ,message: "Service deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};
