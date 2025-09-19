import { ApiError, asyncHandler, HttpStatus } from "@/utils/core";

export const isAdmin = asyncHandler(async (req, res, next) => {
  if (!req.user) {
    throw new ApiError(HttpStatus.UNAUTHORIZED, "Unauthorized");
  }

  const { role } = req.user;

  if (role !== "admin") {
    throw new ApiError(HttpStatus.UNAUTHORIZED, "Access denied. Admins only.");
  }

  next();
});
