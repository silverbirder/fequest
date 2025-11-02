/// <reference types="node" />
import { type Config } from "drizzle-kit";
import { config as loadEnv } from "dotenv";
import path from "node:path";
import { fileURLToPath } from "node:url";

const configDir = path.dirname(fileURLToPath(import.meta.url));
const envPath =
  process.env.DOTENV_CONFIG_PATH ?? path.resolve(configDir, ".env");

loadEnv({ path: envPath });

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error(
    "DATABASE_URL is not defined. Set it in your environment or provide DOTENV_CONFIG_PATH when running drizzle-kit.",
  );
}

export default {
  schema: "./src/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: databaseUrl,
  },
  tablesFilter: ["fequest_*"],
} satisfies Config;
