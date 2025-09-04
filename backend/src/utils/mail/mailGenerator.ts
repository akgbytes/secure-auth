import Mailgen from "mailgen";
import { env } from "@/config/env";

export const mailGenerator = new Mailgen({
  theme: "default",
  product: {
    name: "Secure Auth",
    link: env.APP_ORIGIN,
  },
});

export const emailVerificationMailContent = (name: string, otp: string) => ({
  body: {
    name: name,
    intro: `Welcome to Secure Auth! 🎉 We're excited to have you onboard.`,
    table: {
      data: [
        {
          "Your OTP": otp,
        },
      ],
    },
    outro: `
      This OTP is valid for 30 minutes.

      If you did not request this, please ignore this email or contact support at support@secureauth.com.
    `,
    signature: false,
  },
});

export const resetPasswordMailContent = (name: string, link: string) => ({
  body: {
    name,
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
