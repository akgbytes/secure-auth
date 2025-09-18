import crypto from "crypto";

export function randomString(len = 32) {
  return crypto.randomBytes(len).toString("hex");
}

export function generateCodeVerifier(len = 64): string {
  return crypto.randomBytes(len).toString("base64url"); // Node 16+ supports 'base64url'
}

// Generate PKCE challenge from verifier (SHA256 → base64url)
export function pkceChallenge(verifier: string): string {
  return crypto
    .createHash("sha256")
    .update(verifier)
    .digest("base64") // normal base64
    .replace(/\+/g, "-") // convert to base64url
    .replace(/\//g, "_")
    .replace(/=+$/, ""); // strip padding
}

export const cookieOptionsForOauth: any = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  maxAge: 10 * 60 * 1000, // 10 minutes in ms
  sameSite: "lax", // 'lax' works well for OAuth redirect flows
  path: "/",
};
