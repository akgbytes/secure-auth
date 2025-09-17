import { env } from "@/config/env";
import ms, { StringValue } from "ms";

export const sessionExpiresAfter = () =>
  new Date(Date.now() + ms(env.REFRESH_TOKEN_EXPIRY as StringValue));
