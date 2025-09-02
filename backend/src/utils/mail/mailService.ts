import Mailgen from "mailgen";
import { mailGenerator } from "@/utils/mail/mailGenerator";
import { mailtrapClient } from "@/utils/mail/mailtrapClient";
import { env } from "@/config/env";
import { ApiError } from "@/core";

const sender = { name: "Secure Auth", email: env.MAILTRAP_SENDER_EMAIL };

export const sendMail = async (
  to: string,
  subject: string,
  content: Mailgen.Content
) => {
  const html = mailGenerator.generate(content);
  const text = mailGenerator.generatePlaintext(content);

  try {
    mailtrapClient.send({
      from: sender,
      to: [{ email: to }],
      subject,
      html,
      text,
    });
  } catch (error) {
    throw new ApiError(500, `Failed to send "${subject}" email.`);
  }
};
