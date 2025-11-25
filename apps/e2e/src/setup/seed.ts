import { createDbClient, sessions, users } from "@repo/db";
import { randomUUID } from "node:crypto";

export type SeedSessionData = {
  sessionToken: string;
  userId: string;
};

const buildUserRecord = (id: string) => ({
  email: `${id}@example.com`,
  id,
  name: "E2E User",
});

export const createSeedSession = async (
  databaseUrlForHost: string,
): Promise<SeedSessionData> => {
  const db = createDbClient({
    databaseUrl: databaseUrlForHost,
    nodeEnv: "test",
  });
  const userId = `e2e-user-${randomUUID()}`;

  await db.insert(users).values(buildUserRecord(userId));

  const sessionToken = `e2e-session-${randomUUID()}`;

  await db.insert(sessions).values({
    expires: new Date(Date.now() + 1000 * 60 * 60),
    sessionToken,
    userId,
  });

  return { sessionToken, userId };
};
