import { hash, verify } from "@node-rs/argon2";

export const hashPassword = async (password: string): Promise<string> => {
  return await hash(password);
};

export const verifyPasswordHash = async (
  hash: string,
  password: string
): Promise<boolean> => {
  return await verify(hash, password);
};
