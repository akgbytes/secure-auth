import { env } from "@/config/env";
import { MailtrapClient } from "mailtrap";

export const mailtrapClient = new MailtrapClient({
  token: env.MAILTRAP_API_TOKEN,
});
