import { sendMail } from "@/utils/mail/mailService";
import { env } from "@/config/env";
import { passwordResetTemplate, verifyEmailTemplate } from "./mailTemplates";

export const sendVerificationMail = async (email: string, token: string) => {
  const link = `${env.APP_ORIGIN}/email-verify?token=${encodeURIComponent(
    token
  )}`;
  const { html, text, subject } = verifyEmailTemplate(link);
  await sendMail(email, subject, text, html);
};

export const sendResetPasswordMail = async (email: string, token: string) => {
  const link = `${env.APP_ORIGIN}/reset-password?token=${encodeURIComponent(
    token
  )}`;
  const { html, text, subject } = passwordResetTemplate(link);
  await sendMail(email, subject, text, html);
};
