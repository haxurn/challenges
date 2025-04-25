import { env } from "@haxurn-core/config";

const config = {
	out: "./migrations",
	schema: "./src/schema",
	dialect: "postgresql",
	dbCredentials: {
		url: env.DATABASE_URL, 
	},
	verbose: true,
	strict: true,
	breakpoints: true,
	schemaFilter: ["public"],
};
export default config;
