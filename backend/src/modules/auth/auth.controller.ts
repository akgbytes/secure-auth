import { ApiResponse, asyncHandler, HttpStatus } from "@/core";
import { handleZodError } from "@/utils/handleZodError";
import { validateRegister } from "./auth.validators";
import { registerUser } from "./auth.service";

export const register = asyncHandler(async (req, res) => {
  const data = handleZodError(validateRegister(req.body));
  const user = await registerUser(data);

  res
    .status(201)
    .json(
      new ApiResponse(
        HttpStatus.CREATED,
        "Registered successfully, Please verify your email.",
        null
      )
    );
});
