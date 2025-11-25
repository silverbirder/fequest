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

export const startUser = async (
  network: StartedNetwork,
  databaseUrl: string,
) => {
  const userContainer = await GenericContainer.fromDockerfile(
    repoRoot,
    userDockerfilePath,
  ).build("fequest-user", { deleteOnExit: true });

  const container = await userContainer
    .withEnvironment({
      AUTH_TRUST_HOST: "true",
      DATABASE_URL: databaseUrl,
    })
    .withNetwork(network)
    .withExposedPorts(USER_PORT)
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
