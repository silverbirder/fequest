import { drizzle, type PostgresJsDatabase } from "drizzle-orm/postgres-js";
import type { Sql } from "postgres";
import postgres from "postgres";

import * as schema from "./schema";

export type Database = PostgresJsDatabase<typeof schema>;

type PostgresOptions = Parameters<typeof postgres>[1];

export type CreateDbOptions = {
  databaseUrl: string;
  nodeEnv?: "development" | "test" | "production";
  postgresOptions?: PostgresOptions;
};

const connectionSymbol = Symbol.for("@repo/db:postgres-connection");
type ConnectionGlobal = typeof globalThis & {
  [connectionSymbol]?: Sql;
};

const getOrCreateConnection = ({
  databaseUrl,
  nodeEnv = "development",
  postgresOptions,
}: CreateDbOptions): Sql => {
  const globalTarget = globalThis as ConnectionGlobal;
  const shouldCache = nodeEnv !== "production";

  if (shouldCache && globalTarget[connectionSymbol]) {
    return globalTarget[connectionSymbol]!;
  }

  const connection = postgres(databaseUrl, postgresOptions);

  if (shouldCache) {
    globalTarget[connectionSymbol] = connection;
  }

  return connection;
};

export const createDbClient = (options: CreateDbOptions): Database => {
  const connection = getOrCreateConnection(options);
  return drizzle(connection, { schema });
};

export const resetCachedConnection = (): void => {
  const globalTarget = globalThis as ConnectionGlobal;
  if (globalTarget[connectionSymbol]) {
    delete globalTarget[connectionSymbol];
  }
};

export { schema };
