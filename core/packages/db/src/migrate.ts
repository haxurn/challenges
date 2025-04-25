import { drizzle } from "drizzle-orm/node-postgres";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import { Pool } from "pg";
import chalk from "chalk";
import { env } from "@haxurn-core/config";

const migrationsFolder = "migrations";
const pool = new Pool({
	connectionString: env.DATABASE_URL,
});

const db = drizzle(pool);

async function runMigrations() {
	try {
		console.log(chalk.blue("⌗ Starting Migration"));
		await migrate(db, {
			migrationsFolder: migrationsFolder,
		});
		console.log(chalk.green("✅: [Migration Complete]"));
	} catch (error) {
		console.error(chalk.red("❗️:[Migration Failed]", error));
		process.exit(1);
	} finally {
		await pool.end();
	}
}

runMigrations();
