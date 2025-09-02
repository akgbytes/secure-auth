import { sendMail } from "@/utils/mail/mailService";
import {
  emailVerificationMailContent,
  resetPasswordMailContent,
} from "@/utils/mail/mailGenerator";
import { env } from "@/config/env";
import { capitalize } from "@/utils";

export const sendVerificationMail = async (
  fullname: string,
  email: string,
  token: string
) => {
  const link = `${env.APP_ORIGIN}/verify-email/${token}`;
  const name = capitalize(fullname);
  await sendMail(
    email,
    "Verify Your Email",
    emailVerificationMailContent(name, link)
  );
};

export const sendResetPasswordMail = async (
  fullname: string,
  email: string,
  token: string
) => {
  const link = `${env.APP_ORIGIN}/reset-password/${token}`;
  const name = capitalize(fullname);
  await sendMail(
    email,
    "Reset Your Password",
    resetPasswordMailContent(name, link)
  );
};
