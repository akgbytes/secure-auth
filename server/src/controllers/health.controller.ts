import { ApiResponse } from "@/utils/ApiResponse";
import { asyncHandler } from "@/utils/asyncHandler";
import { HttpStatus } from "@/utils/httpStatus";

export const checkHealth = asyncHandler(async (req, res) => {
  res
    .status(HttpStatus.OK)
    .json(new ApiResponse(HttpStatus.OK, "Health check passed", null));
});
