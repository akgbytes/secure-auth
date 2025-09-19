import { hash, verify } from "@node-rs/argon2";
import { ApiError, HttpStatus } from "./core";

export const hashPassword = async (password: string): Promise<string> => {
  return await hash(password);
};

export const verifyPasswordHash = async (
  hash: string,
  password: string,
  type: "login" | "reset"
): Promise<boolean> => {
  try {
    return await verify(hash, password);
  } catch (error) {
    if (type === "login")
      throw new ApiError(HttpStatus.UNAUTHORIZED, "Invalid credentials");

    throw new ApiError(
      HttpStatus.BAD_REQUEST,
      "New password cannot be the same as the old password"
    );
  }
};
