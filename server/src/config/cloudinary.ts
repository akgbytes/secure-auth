import fs from "node:fs/promises";
import path from "node:path";
import { v2 as cloudinary } from "cloudinary";
import { ApiError, logger } from "@/utils/core";
import { env } from "./env";

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
	} catch (error) {
		const message =
			error instanceof Error ? error.message : "Failed to upload to Cloudinary";
		throw new ApiError(500, message);
	} finally {
		try {
			const absolutePath = path.resolve(localFilePath);
			await fs.unlink(absolutePath);
		} catch (unlinkErr) {
			logger.warn(`Failed to delete local file: ${localFilePath}`, unlinkErr);
		}
	}
};
