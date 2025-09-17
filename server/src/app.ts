import express from "express";
import { errorHandler } from "@/middlewares/error.middleware";

export const app = express();

app.use(errorHandler);
