import { ApiResponse, asyncHandler, HttpStatus } from "@/core";
import { handleZodError } from "@/utils/handleZodError";
import { validateRegister, registerUser } from "@/modules/auth";

export const register = asyncHandler(async (req, res) => {
  const data = handleZodError(validateRegister(req.body));
  const user = await registerUser(data);

  res
    .status(201)
    .json(
      new ApiResponse(HttpStatus.CREATED, "User registered successfully", user)
    );
});
