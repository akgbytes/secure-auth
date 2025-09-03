export const VerificationType = {
  email_verify: "email_verify",
  forgot_password: "forgot_password",
} as const;

export type VerificationType =
  (typeof VerificationType)[keyof typeof VerificationType];
