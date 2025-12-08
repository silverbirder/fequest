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
const adminDockerfilePath = "apps/admin/Dockerfile";
const ADMIN_PORT = 3001;
const USER_PORT = 3000;

type StartAdminOptions = Readonly<{
  hostPort?: number;
  userDomainUrl?: string;
}>;

export const startAdmin = async (
  network: StartedNetwork,
  databaseUrl: string,
  options: StartAdminOptions = {},
) => {
  const adminHostPort = options.hostPort ?? ADMIN_PORT;
  const userDomainUrl =
    options.userDomainUrl ?? `http://127.0.0.1:${USER_PORT}`;

  const adminContainer = await GenericContainer.fromDockerfile(
    repoRoot,
    adminDockerfilePath,
  ).build("fequest-admin", { deleteOnExit: true });

  const container = await adminContainer
    .withEnvironment({
      AUTH_GOOGLE_ID: "dummy-admin-google-id",
      AUTH_GOOGLE_SECRET: "dummy-admin-google-secret",
      AUTH_SECRET: "dummy-admin-auth-secret",
      AUTH_TRUST_HOST: "true",
      DATABASE_URL: databaseUrl,
      SKIP_ENV_VALIDATION: "1",
      USER_DOMAIN_URL: userDomainUrl,
    })
    .withNetwork(network)
    .withExposedPorts({ container: ADMIN_PORT, host: adminHostPort })
    .start();

  const mappedPort = container.getMappedPort(ADMIN_PORT);
  const host = container.getHost();

  return { container, url: `http://${host}:${mappedPort}` } as const;
};

export const stopAdmin = async (container?: StartedTestContainer) => {
  if (!container) {
    return;
  }

  await container.stop({ remove: true, removeVolumes: true });
};
