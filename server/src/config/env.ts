import { NODE_ENV } from "@/constants";
import { logger } from "@/utils/core";
import "dotenv/config";
import * as z from "zod";

const envSchema = z.object({
	PORT: validNumericString("PORT").default(8080),

	DATABASE_URL: validUrl("DATABASE_URL"),

	NODE_ENV: z.enum(NODE_ENV, {
		error: (issue) => `NODE ENV must be ${issue.values.join(" | ")}`,
	}),

	APP_ORIGIN: validUrl("APP_ORIGIN"),

	TOKEN_EXPIRY_IN_MINUTES: validNumericString("TOKEN_EXPIRY_IN_MINUTES"),
	MAILTRAP_API_TOKEN: validString("MAILTRAP_API_TOKEN"),
	MAILTRAP_SENDER_EMAIL: validString("MAILTRAP_SENDER_EMAIL"),

	ACCESS_TOKEN_SECRET: validString("ACCESS_TOKEN_SECRET"),
	ACCESS_TOKEN_EXPIRY: validString("ACCESS_TOKEN_EXPIRY"),

	REFRESH_TOKEN_SECRET: validString("REFRESH_TOKEN_SECRET"),
	REFRESH_TOKEN_EXPIRY: validString("REFRESH_TOKEN_EXPIRY"),

	GOOGLE_CLIENT_ID: validString("GOOGLE_CLIENT_ID"),
	GOOGLE_CLIENT_SECRET: validString("GOOGLE_CLIENT_SECRET"),

	REDIRECT_URI: validUrl("REDIRECT_URI"),

	GITHUB_CLIENT_ID: validString("GITHUB_CLIENT_ID"),
	GITHUB_CLIENT_SECRET: validString("GITHUB_CLIENT_SECRET"),

	CLOUDINARY_CLOUD_NAME: validString("CLOUDINARY_CLOUD_NAME"),
	CLOUDINARY_API_KEY: validString("CLOUDINARY_API_KEY"),
	CLOUDINARY_API_SECRET: validString("CLOUDINARY_API_SECRET"),
});

const createEnv = (env: NodeJS.ProcessEnv) => {
	const result = envSchema.safeParse(env);

	if (!result.success) {
		const messages = result.error.issues
			.map((issue) => `  • ${issue.message}`)
			.join("\n");
		logger.error(`Invalid environment variables:\n${messages}`);
		process.exit(1);
	}

	return result.data;
};

export const env = createEnv(process.env);

function validNumericString(fieldName: string) {
	return z
		.string({ error: `${fieldName} is required` })
		.trim()
		.nonempty({ error: `${fieldName} is required` })
		.regex(/^\d+$/, { error: `${fieldName} must be a valid number` })
		.transform((val) => Number(val));
}

function validUrl(fieldName: string) {
	return z.url({
		error: (iss) => {
			if (iss.code === "invalid_type") return `${fieldName} is required`;
			return `${fieldName} must be a valid URL`;
		},
	});
}

function validString(fieldName: string) {
	return z
		.string({
			error: (iss) =>
				iss.input === undefined
					? `${fieldName} is required`
					: `${fieldName} must be a string`,
		})
		.trim()
		.min(1, `${fieldName} cannot be empty`);
}
