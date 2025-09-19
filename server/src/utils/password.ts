import { hash, verify } from "@node-rs/argon2";
import { ApiError, HttpStatus } from "./core";

export const hashPassword = async (password: string): Promise<string> => {
  return await hash(password);
};

export const verifyPasswordHash = async (
  hash: string,
  password: string
): Promise<boolean> => {
  try {
    return await verify(hash, password);
  } catch (error) {
    throw new ApiError(HttpStatus.UNAUTHORIZED, "Invalid credentials");
  }
};
