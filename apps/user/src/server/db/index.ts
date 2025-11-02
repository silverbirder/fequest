import { createDbClient } from "@repo/db";

import { env } from "~/env";

export const db = createDbClient({
  databaseUrl: env.DATABASE_URL,
  nodeEnv: env.NODE_ENV,
});
