export const Provider = {
  local: "local",
  google: "google",
  github: "github",
} as const;

export const UserRole = {
  admin: "admin",
  user: "user",
} as const;

export const TokenType = {
  verify_email: "verify_email",
  reset_password: "reset_password",
} as const;

export type Provider = (typeof Provider)[keyof typeof Provider];
export type UserRole = (typeof UserRole)[keyof typeof UserRole];
export type TokenType = (typeof TokenType)[keyof typeof TokenType];
