import { env } from "@/config/env";
import crypto from "crypto";

export const hashToken = (rawToken: string) =>
  crypto.createHash("sha256").update(rawToken).digest("hex");

export const generateToken = () => {
  const rawToken = crypto.randomBytes(32).toString("hex");
  const tokenHash = hashToken(rawToken);
  const tokenExpiry = new Date(
    Date.now() + env.TOKEN_EXPIRY_IN_MINUTES * 60 * 1000
  );

  return { rawToken, tokenHash, tokenExpiry };
};
