import dotenv from "dotenv";
import { envSchema } from "./schema/env.schema";
import chalk from "chalk";

dotenv.config({ path: require("path").resolve(__dirname, "../../../.env") });;

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  console.error(chalk.red("⚠️ Environment variable validation failed:", parsedEnv.error.errors));
  process.exit(1); 
}

export const env = parsedEnv.data;
