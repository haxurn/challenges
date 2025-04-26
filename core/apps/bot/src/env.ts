// apps/bot/src/env.ts
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import chalk from 'chalk';

// Resolve the directory name in ES module scope
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../../../.env') });

export const BOT_TOKEN = process.env.BOT_TOKEN;
export const BOT_API_URL = process.env.BOT_API_URL;

if (!BOT_TOKEN) {
    console.error(chalk.red("🚨 Critical Error: BOT_TOKEN is missing in the .env file."));
    process.exit(1);
}

if (!BOT_API_URL) {
    console.error(chalk.red("🚨 Critical Error: BOT_API_URL is missing in the .env file."));
    console.error(chalk.yellow("💡 Hint: Ensure it points to the backend API (e.g., http://localhost:3001)."));
    process.exit(1);
}

console.log(chalk.green(`✅ [Bot Env] BOT_API_URL successfully set to: ${BOT_API_URL}`));