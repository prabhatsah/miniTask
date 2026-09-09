import "dotenv/config";
import { runner } from "node-pg-migrate";

async function migrate() {
  await runner({
    databaseUrl: `postgresql://${encodeURIComponent(process.env.DB_USER!)}:${encodeURIComponent(
      process.env.DB_PASSWORD!,
    )}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`,

    dir: "migrations",

    direction: "up",

    count: Infinity,

    migrationsTable: "pgmigrations",
  });
}

migrate().catch((error) => {
  console.error("Migration failed:", error);
  process.exit(1);
});
