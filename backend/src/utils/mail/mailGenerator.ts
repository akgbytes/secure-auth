import { env } from "@/config/env";
import Mailgen from "mailgen";

export const mailGenerator = new Mailgen({
  theme: "default",
  product: {
    name: "Secure Auth",
    link: env.APP_ORIGIN,
  },
});

export const emailVerificationMailContent = (
  fullName: string,
  link: string
) => ({
  body: {
    name: fullName,
    intro: "Welcome to Secure Auth! We're excited to have you onboard.",
    action: {
      instructions:
        "To complete your registration, please verify your email by clicking below:",
      button: {
        color: "#22BC66",
        text: "Verify Email",
        link,
      },
    },
    outro: "If you have any questions, just reply to this email.",
    signature: false,
  },
});

export const resetPasswordMailContent = (fullName: string, link: string) => ({
  body: {
    name: fullName,
    intro: "You requested to reset your password.",
    action: {
      instructions: "Click the button below to reset your password:",
      button: {
        color: "#FF613C",
        text: "Reset Password",
        link,
      },
    },
    outro: "If you didn’t request this, please ignore this email.",
    signature: false,
  },
});
