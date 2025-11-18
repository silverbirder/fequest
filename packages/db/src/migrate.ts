import { migrate } from "drizzle-orm/postgres-js/migrator";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { createDbClient } from "./client";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const DEFAULT_MIGRATIONS_FOLDER = resolve(__dirname, "../drizzle");

type MigrateDatabaseOptions = {
  nodeEnv?: "development" | "test" | "production";
  migrationsFolder?: string;
};

export const migrateDatabase = async (
  databaseUrl: string,
  options: MigrateDatabaseOptions = {},
): Promise<void> => {
  const { nodeEnv = "test", migrationsFolder = DEFAULT_MIGRATIONS_FOLDER } =
    options;

  const db = createDbClient({ databaseUrl, nodeEnv });
  await migrate(db, { migrationsFolder });
};
