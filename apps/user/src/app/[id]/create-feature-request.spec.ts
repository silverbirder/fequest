import { afterEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  create: vi.fn(),
  revalidatePath: vi.fn(),
}));

vi.mock("~/trpc/server", () => ({
  api: {
    featureRequests: {
      create: mocks.create,
    },
  },
}));

vi.mock("next/cache", () => ({
  revalidatePath: mocks.revalidatePath,
}));

import { createCreateFeatureRequest } from "./create-feature-request";

const createFormData = (fields: Record<string, string>) => {
  const formData = new FormData();
  Object.entries(fields).forEach(([key, value]) => {
    formData.set(key, value);
  });
  return formData;
};

afterEach(() => {
  vi.clearAllMocks();
  mocks.create.mockReset();
  mocks.revalidatePath.mockReset();
});

describe("createCreateFeatureRequest", () => {
  it("submits trimmed title", async () => {
    const action = createCreateFeatureRequest({ productId: 11 });

    await action(createFormData({ title: "  Dark mode  " }));

    expect(mocks.create).toHaveBeenCalledWith({
      productId: 11,
      title: "Dark mode",
    });
    expect(mocks.revalidatePath).toHaveBeenCalledWith("/11");
  });

  it("bails when the title is empty", async () => {
    const action = createCreateFeatureRequest({ productId: 4 });

    await action(createFormData({ title: "   " }));

    expect(mocks.create).not.toHaveBeenCalled();
    expect(mocks.revalidatePath).not.toHaveBeenCalled();
  });

  it("still revalidates when creation fails", async () => {
    mocks.create.mockRejectedValueOnce(new Error("boom"));
    const action = createCreateFeatureRequest({ productId: 7 });

    await action(createFormData({ title: "Share reports" }));

    expect(mocks.create).toHaveBeenCalledWith({
      productId: 7,
      title: "Share reports",
    });
    expect(mocks.revalidatePath).toHaveBeenCalledWith("/7");
  });
});
