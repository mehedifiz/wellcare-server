import express from "express";

export const urlEncoderMiddleware = express.urlencoded({
  extended: true,
  limit: "50mb",
});
