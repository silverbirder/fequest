import { afterEach, describe, expect, it, vi } from "vitest";

const loadMetadata = async () => {
  const mod = await import("./layout");
  return mod.metadata;
};

describe("user layout metadata", () => {
  afterEach(() => {
    vi.resetModules();
    vi.unstubAllEnvs();
  });

  it("uses BASE_URL when provided", async () => {
    vi.stubEnv("SKIP_ENV_VALIDATION", "1");
    vi.stubEnv("BASE_URL", "https://example.com");
    vi.stubEnv("NODE_ENV", "development");

    const metadata = await loadMetadata();

    expect(metadata.metadataBase?.toString()).toBe("https://example.com/");
  });

  it("defaults to localhost in non-production", async () => {
    vi.stubEnv("SKIP_ENV_VALIDATION", "1");
    vi.stubEnv("NODE_ENV", "development");

    const metadata = await loadMetadata();

    expect(metadata.metadataBase?.toString()).toBe("http://localhost:3000/");
  });

  it("defaults to Vercel URL in production", async () => {
    vi.stubEnv("SKIP_ENV_VALIDATION", "1");
    vi.stubEnv("NODE_ENV", "production");

    const metadata = await loadMetadata();

    expect(metadata.metadataBase?.toString()).toBe(
      "https://fequest.vercel.app/",
    );
  });
});
