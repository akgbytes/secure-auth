import { v2 as cloudinary } from "cloudinary";
import fs from "fs/promises";
import path from "path";
import { env } from "./env";
import { ApiError } from "@/utils/core";
import { logger } from "./logger";

cloudinary.config({
  cloud_name: env.CLOUDINARY_CLOUD_NAME,
  api_key: env.CLOUDINARY_API_KEY,
  api_secret: env.CLOUDINARY_API_SECRET,
});

export const uploadOnCloudinary = async (localFilePath: string) => {
  if (!localFilePath) {
    throw new ApiError(400, "No file path provided");
  }

  try {
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });

    return response;
  } catch (error: any) {
    throw new ApiError(500, error.message);
  } finally {
    try {
      const absolutePath = path.resolve(localFilePath);
      await fs.unlink(absolutePath);
    } catch (unlinkErr) {
      logger.warn(`Failed to delete local file: ${localFilePath}`, unlinkErr);
    }
  }
};
