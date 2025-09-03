import { ApiResponse, asyncHandler, HttpStatus } from "@/core";
import { handleZodError } from "@/utils/handleZodError";
import { validateLogin, validateRegister } from "./auth.validators";
import { loginUser, registerUser } from "./auth.service";
import { setAuthCookies } from "@/utils/cookies";

export const register = asyncHandler(async (req, res) => {
  const data = handleZodError(validateRegister(req.body));
  const user = await registerUser(data);

  res
    .status(HttpStatus.CREATED)
    .json(
      new ApiResponse(
        HttpStatus.CREATED,
        "Registered successfully, Please verify your email.",
        user
      )
    );
});

export const login = asyncHandler(async (req, res) => {
  const data = handleZodError(validateLogin(req.body));
  const userAgent = req.headers["user-agent"];

  const { refreshToken, accessToken, MFA_Required } = await loginUser({
    ...data,
    userAgent: userAgent || "",
    ipAddress: req.ip || "",
  });

  setAuthCookies(res, accessToken, refreshToken);

  res
    .status(HttpStatus.OK)
    .json(
      new ApiResponse(HttpStatus.OK, "Logged in successfully", { MFA_Required })
    );
});
