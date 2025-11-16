import { afterEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => {
  return {
    cookies: vi.fn(),
    react: vi.fn(),
    revalidatePath: vi.fn(),
  };
});

vi.mock("~/trpc/server", () => ({
  api: {
    featureRequests: {
      react: mocks.react,
    },
  },
}));

vi.mock("next/cache", () => ({
  revalidatePath: mocks.revalidatePath,
}));

vi.mock("next/headers", () => ({
  cookies: mocks.cookies,
}));

import { ANONYMOUS_IDENTIFIER_COOKIE_NAME } from "@repo/user-cookie";

import { createReactToFeature } from "./react-to-feature";

type MockCookieStore = {
  get: ReturnType<typeof vi.fn>;
  set: ReturnType<typeof vi.fn>;
};

const createCookieStore = (initialValue?: string): MockCookieStore => {
  let storedValue = initialValue;

  return {
    get: vi.fn(() => (storedValue ? { value: storedValue } : undefined)),
    set: vi.fn((options: { value: string }) => {
      storedValue = options.value;
    }),
  };
};

const createFormData = (fields: Record<string, string>) => {
  const formData = new FormData();
  Object.entries(fields).forEach(([key, value]) => {
    formData.set(key, value);
  });
  return formData;
};

afterEach(() => {
  vi.clearAllMocks();
});

describe("createReactToFeature", () => {
  it("reacts to a feature when the submission is valid", async () => {
    const cookieStore = createCookieStore("anon-xyz");
    mocks.cookies.mockResolvedValue(cookieStore);

    const reactToFeature = createReactToFeature({ productId: 42 });
    const formData = createFormData({
      action: "up",
      emoji: "🔥",
      featureId: "4",
    });

    await reactToFeature(formData);

    expect(mocks.react).toHaveBeenCalledWith({
      action: "up",
      anonymousIdentifier: "anon-xyz",
      emoji: "🔥",
      id: 4,
    });
    expect(mocks.revalidatePath).toHaveBeenCalledWith("/42");
    expect(cookieStore.set).not.toHaveBeenCalled();
  });

  it("creates an anonymous identifier when no cookie is present", async () => {
    const cookieStore = createCookieStore();
    mocks.cookies.mockResolvedValue(cookieStore);
    const uuid = "generated-123";
    const uuidSpy = vi.spyOn(crypto, "randomUUID").mockReturnValue(uuid);

    try {
      const reactToFeature = createReactToFeature({ productId: 15 });
      const formData = createFormData({
        action: "down",
        emoji: "👍",
        featureId: "11",
      });

      await reactToFeature(formData);

      expect(cookieStore.set).toHaveBeenCalledWith(
        expect.objectContaining({
          name: ANONYMOUS_IDENTIFIER_COOKIE_NAME,
          value: uuid,
        }),
      );
      expect(mocks.react).toHaveBeenCalledWith({
        action: "down",
        anonymousIdentifier: uuid,
        emoji: "👍",
        id: 11,
      });
    } finally {
      uuidSpy.mockRestore();
    }
  });

  it("short-circuits when the payload is invalid", async () => {
    const reactToFeature = createReactToFeature({ productId: 999 });

    await reactToFeature(
      createFormData({
        action: "sideways",
        emoji: "",
        featureId: "not-a-number",
      }),
    );

    expect(mocks.cookies).not.toHaveBeenCalled();
    expect(mocks.react).not.toHaveBeenCalled();
    expect(mocks.revalidatePath).not.toHaveBeenCalled();
  });
});
