import { ApiResponse } from "@/utils/ApiResponse";
import { asyncHandler } from "@/utils/asyncHandler";

export const checkHealth = asyncHandler(async (req, res) => {
  res.status(200).json(new ApiResponse("Health check passed", null));
});
