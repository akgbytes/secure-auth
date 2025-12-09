import { ApiResponse, asyncHandler, HttpStatus } from "@/utils/core";

export const checkHealth = asyncHandler(async (req, res) => {
  res
    .status(HttpStatus.OK)
    .json(new ApiResponse(HttpStatus.OK, "Health check passed", null));
});
