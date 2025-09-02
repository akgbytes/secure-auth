import { MailtrapClient } from "mailtrap";
import { env } from "@/config/env";

export const mailtrapClient = new MailtrapClient({
  token: env.MAILTRAP_API_TOKEN,
});
