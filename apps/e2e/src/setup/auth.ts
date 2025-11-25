import { createDbClient, sessions } from "@repo/db";
import { randomUUID } from "node:crypto";

export const createUserSession = async (
  databaseUrl: string,
  userId: string,
) => {
  const db = createDbClient({ databaseUrl, nodeEnv: "test" });
  const sessionToken = `e2e-session-${randomUUID()}`;

  await db.insert(sessions).values({
    expires: new Date(Date.now() + 1000 * 60 * 60),
    sessionToken,
    userId,
  });

  return sessionToken;
};
