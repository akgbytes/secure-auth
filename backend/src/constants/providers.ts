export const Provider = {
  local: "local",
  github: "github",
  google: "google",
} as const;

export type Provider = (typeof Provider)[keyof typeof Provider];
