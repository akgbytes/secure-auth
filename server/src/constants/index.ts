export const PROVIDER = {
	local: "local",
	google: "google",
	github: "github",
} as const;

export const USER_ROLE = {
	admin: "admin",
	user: "user",
} as const;

export const TOKEN_TYPE = {
	verify_email: "verify_email",
	reset_password: "reset_password",
} as const;

export const NODE_ENV = {
	development: "development",
	production: "production",
	test: "test",
} as const;

export type Provider = (typeof PROVIDER)[keyof typeof PROVIDER];
export type UserRole = (typeof USER_ROLE)[keyof typeof USER_ROLE];
export type TokenType = (typeof TOKEN_TYPE)[keyof typeof TOKEN_TYPE];
export type NodeEnv = (typeof NODE_ENV)[keyof typeof NODE_ENV];
