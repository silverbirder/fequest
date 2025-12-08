import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import {
  GenericContainer,
  StartedNetwork,
  StartedTestContainer,
} from "testcontainers";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const repoRoot = resolve(__dirname, "../../../..");
const userDockerfilePath = "apps/user/Dockerfile";
const USER_PORT = 3000;
const ADMIN_PORT = 3001;

type StartUserOptions = Readonly<{
  adminDomainUrl?: string;
  hostPort?: number;
}>;

export const startUser = async (
  network: StartedNetwork,
  databaseUrl: string,
  options: StartUserOptions = {},
) => {
  const userHostPort = options.hostPort ?? USER_PORT;
  const adminDomainUrl =
    options.adminDomainUrl ?? `http://127.0.0.1:${ADMIN_PORT}`;

  const userContainer = await GenericContainer.fromDockerfile(
    repoRoot,
    userDockerfilePath,
  ).build("fequest-user", { deleteOnExit: true });

  const container = await userContainer
    .withEnvironment({
      ADMIN_DOMAIN_URL: adminDomainUrl,
      AUTH_GOOGLE_ID: "dummy-user-google-id",
      AUTH_GOOGLE_SECRET: "dummy-user-google-secret",
      AUTH_SECRET: "dummy-user-auth-secret",
      AUTH_TRUST_HOST: "true",
      DATABASE_URL: databaseUrl,
      SKIP_ENV_VALIDATION: "1",
    })
    .withNetwork(network)
    .withExposedPorts({ container: USER_PORT, host: userHostPort })
    .start();

  const mappedPort = container.getMappedPort(USER_PORT);
  const host = container.getHost();

  return { container, url: `http://${host}:${mappedPort}` } as const;
};

export const stopUser = async (container?: StartedTestContainer) => {
  if (!container) {
    return;
  }

  await container.stop({ remove: true, removeVolumes: true });
};
