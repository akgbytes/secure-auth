import { ApiResponse, asyncHandler, HttpStatus } from "@/core";
import { handleZodError } from "@/utils/handleZodError";
import { validateRegister } from "./auth.validators";
import { registerUser } from "./auth.service";
import { logger } from "@/utils/logger";

export const register = asyncHandler(async (req, res) => {
  const data = handleZodError(validateRegister(req.body));
  logger.info({ email: data.email, ip: req.ip }, "Registration attempt by: ");
  const user = await registerUser(data);

  logger.info(
    {
      email: data.email,
      userId: user.id,
      ip: req.ip,
    },
    "Verification email sent: "
  );

  logger.info(
    {
      email: data.email,
      userId: user.id,
      ip: req.ip,
    },
    "User registered successfully: "
  );

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
