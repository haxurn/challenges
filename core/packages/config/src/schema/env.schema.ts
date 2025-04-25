import { z } from "zod";

export const envSchema = z.object({
	NODE_ENV: z
		.enum(["development", "production", "test"])
		.default("development"),
	PORT: z.coerce.number().default(3000),
	DATABASE_URL: z
		.string()
		.url("Invalid database URL format")
		.min(1, "DATABASE_URL is required")
		.refine((url) => url.startsWith("postgresql://"), {
			message: "DATABASE_URL must use the 'postgresql' protocol",
		}),
	LOG_LEVEL: z
		.enum(["debug", "info", "warn", "error", "fatal"])
		.default("info"), 
	API_KEY: z
		.string()
		.min(32, "API_KEY must be at least 32 characters long")
		.optional(),
	REDIS_URL: z
		.string()
		.url("Invalid Redis URL format")
		.optional(),
	SESSION_TIMEOUT: z
		.coerce.number()
		.min(300, "SESSION_TIMEOUT must be at least 300 seconds")
		.default(3600),
	ENABLE_CACHING: z
		.boolean()
		.default(true), 
});
