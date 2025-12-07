import { afterEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  revalidatePath: vi.fn(),
  setFeatureStatus: vi.fn(),
}));

vi.mock("~/trpc/server", () => ({
  api: {
    product: {
      setFeatureStatus: mocks.setFeatureStatus,
    },
  },
}));

vi.mock("next/cache", () => ({
  revalidatePath: mocks.revalidatePath,
}));

import { createUpdateFeatureStatus } from "./update-feature-status";

const createFormData = (fields: Record<string, number | string>) => {
  const formData = new FormData();
  Object.entries(fields).forEach(([key, value]) =>
    formData.set(key, value.toString()),
  );
  return formData;
};

afterEach(() => {
  vi.clearAllMocks();
  mocks.revalidatePath.mockReset();
  mocks.setFeatureStatus.mockReset();
});

describe("createUpdateFeatureStatus", () => {
  it("submits feature status and revalidates path", async () => {
    const action = createUpdateFeatureStatus({ productId: 5 });

    await action(createFormData({ featureId: 10, status: "closed" }));

    expect(mocks.setFeatureStatus).toHaveBeenCalledWith({
      featureId: 10,
      status: "closed",
    });
    expect(mocks.revalidatePath).toHaveBeenCalledWith("/products/5");
  });

  it("bails on invalid status", async () => {
    const action = createUpdateFeatureStatus({ productId: 8 });

    await action(createFormData({ featureId: 9, status: "pending" }));

    expect(mocks.setFeatureStatus).not.toHaveBeenCalled();
    expect(mocks.revalidatePath).not.toHaveBeenCalled();
  });

  it("still revalidates when update fails", async () => {
    mocks.setFeatureStatus.mockRejectedValueOnce(new Error("fail"));
    const action = createUpdateFeatureStatus({ productId: 12 });

    await action(createFormData({ featureId: 33, status: "open" }));

    expect(mocks.setFeatureStatus).toHaveBeenCalled();
    expect(mocks.revalidatePath).toHaveBeenCalledWith("/products/12");
  });
});
