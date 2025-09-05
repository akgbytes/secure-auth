export const Provider = {
  local: "local",
  google: "google",
} as const;

export type Provider = (typeof Provider)[keyof typeof Provider];
