import { sendMail } from "@/utils/mail/mailService";
import {
  emailVerificationMailContent,
  resetPasswordMailContent,
} from "@/utils/mail/mailGenerator";
import { env } from "@/config/env";
import { capitalize } from "@/utils";

export const sendVerificationMail = async (
  name: string,
  email: string,
  otp: string
) => {
  await sendMail(
    email,
    "Verify Your Email",
    emailVerificationMailContent(capitalize(name), otp)
  );
};

export const sendResetPasswordMail = async (
  name: string,
  email: string,
  token: string
) => {
  const link = `${env.APP_ORIGIN}/reset-password?token=${encodeURIComponent(
    token
  )}`;
  await sendMail(
    email,
    "Reset Your Password",
    resetPasswordMailContent(capitalize(name), link)
  );
};
