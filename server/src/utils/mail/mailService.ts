import { mailtrapClient } from "@/utils/mail/mailtrapClient";
import { env } from "@/config/env";
import { ApiError } from "../core";

const sender = { name: "Secure Auth", email: env.MAILTRAP_SENDER_EMAIL };

export const sendMail = async (
  to: string,
  subject: string,
  text: string,
  html: string
) => {
  try {
    mailtrapClient.send({
      from: sender,
      to: [{ email: to }],
      subject,
      html,
      text,
    });
  } catch (error) {
    throw new ApiError(500, `Failed to send "${subject}" email`);
  }
};
