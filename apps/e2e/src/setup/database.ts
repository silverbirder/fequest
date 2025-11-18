import {
  GenericContainer,
  StartedNetwork,
  StartedTestContainer,
  Wait,
} from "testcontainers";

const POSTGRES_IMAGE = "postgres:16";
const POSTGRES_NETWORK_ALIAS = "fequest-db";
const POSTGRES_INTERNAL_PORT = 5432;
const POSTGRES_DB = "fequest";
const POSTGRES_USER = "postgres";
const POSTGRES_PASSWORD = "postgres";

const buildInternalConnectionString = () =>
  `postgresql://${encodeURIComponent(POSTGRES_USER)}:${encodeURIComponent(
    POSTGRES_PASSWORD,
  )}@${POSTGRES_NETWORK_ALIAS}:${POSTGRES_INTERNAL_PORT}/${POSTGRES_DB}`;

const buildHostConnectionString = (host: string, port: number) =>
  `postgresql://${encodeURIComponent(POSTGRES_USER)}:${encodeURIComponent(
    POSTGRES_PASSWORD,
  )}@${host}:${port}/${POSTGRES_DB}`;

export const startDatabase = async (network: StartedNetwork) => {
  const container = await new GenericContainer(POSTGRES_IMAGE)
    .withEnvironment({
      POSTGRES_DB,
      POSTGRES_PASSWORD,
      POSTGRES_USER,
    })
    .withNetwork(network)
    .withNetworkAliases(POSTGRES_NETWORK_ALIAS)
    .withExposedPorts(POSTGRES_INTERNAL_PORT)
    .withWaitStrategy(
      Wait.forLogMessage("database system is ready to accept connections", 2),
    )
    .start();

  const host = container.getHost();
  const mappedPort = container.getMappedPort(POSTGRES_INTERNAL_PORT);

  return {
    connectionString: buildInternalConnectionString(),
    container,
    hostConnectionString: buildHostConnectionString(host, mappedPort),
  } as const;
};

export const stopDatabase = async (container?: StartedTestContainer) => {
  if (!container) {
    return;
  }

  await container.stop({ remove: true, removeVolumes: true });
};
