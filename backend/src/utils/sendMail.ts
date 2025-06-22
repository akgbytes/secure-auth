import Mailgen from "mailgen";
import { env } from "../configs/env";
import { CustomError } from "./CustomError";
import { capitalize } from "./helper";
import { MailtrapClient } from "mailtrap";

const mailGenerator = new Mailgen({
  theme: "default",
  product: {
    name: "Secure Auth",
    link: env.CLIENT_URL,
  },
});

const client = new MailtrapClient({
  token: env.MAILTRAP_TOKEN,
});

const sendMail = async (email: string, subject: string, content: Mailgen.Content) => {
  const html = mailGenerator.generate(content);
  const text = mailGenerator.generatePlaintext(content);

  const sender = {
    email: env.MAILTRAP_SENDERMAIL,
    name: "Secure Auth",
  };

  const recipients = [{ email }];
  try {
    await client.send({
      from: sender,
      to: recipients,
      subject,
      text,
      html,
    });
  } catch (error) {
    throw new CustomError(500, `Failed to send "${subject}" email.`);
  }
};

const emailVerificationMailContent = (fullName: string, link: string) => {
  return {
    body: {
      name: fullName,
      intro: "Welcome to Secure Auth! We're excited to have you on board.",
      action: {
        instructions:
          "To complete your registration, please verify your email by clicking the button below:",
        button: {
          color: "#22BC66",
          text: "Verify Email",
          link: link,
        },
      },

      outro:
        "If you have any questions or need support, just reply to this email—we're here to help!",
      signature: false,
    },
  };
};

const resetPasswordMailContent = (fullName: string, link: string) => {
  return {
    body: {
      name: fullName,
      intro: "It seems like you requested a password reset.",
      action: {
        instructions: "To reset your password, click the button below:",
        button: {
          color: "#FF613C",
          text: "Reset Password",
          link: link,
        },
      },
      outro:
        "If you didn't request this, please ignore this email, or contact support if you have concerns.",
      signature: false,
    },
  };
};

const sendVerificationMail = async (fullName: string, email: string, token: string) => {
  const link = `${env.CLIENT_URL}/verify-email/${token}`;
  const capitalName = capitalize(fullName);

  await sendMail(email, "Verify Your Email", emailVerificationMailContent(capitalName, link));
};

const sendResetPasswordMail = async (fullName: string, email: string, token: string) => {
  const link = `${env.CLIENT_URL}/reset-password/${token}`;
  const capitalName = capitalize(fullName);

  await sendMail(email, "Reset Your Password", resetPasswordMailContent(capitalName, link));
};

export { sendVerificationMail, sendResetPasswordMail };
