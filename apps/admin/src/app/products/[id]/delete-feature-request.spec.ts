import { afterEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  deleteFeatureRequest: vi.fn(),
  revalidatePath: vi.fn(),
}));

vi.mock("~/trpc/server", () => ({
  api: {
    product: {
      deleteFeatureRequest: mocks.deleteFeatureRequest,
    },
  },
}));

vi.mock("next/cache", () => ({
  revalidatePath: mocks.revalidatePath,
}));

import { createDeleteFeatureRequest } from "./delete-feature-request";

const createFormData = (fields: Record<string, number | string>) => {
  const formData = new FormData();
  Object.entries(fields).forEach(([key, value]) =>
    formData.set(key, value.toString()),
  );
  return formData;
};

afterEach(() => {
  vi.clearAllMocks();
  mocks.deleteFeatureRequest.mockReset();
  mocks.revalidatePath.mockReset();
});

describe("createDeleteFeatureRequest", () => {
  it("deletes a feature request and revalidates the product page", async () => {
    const action = createDeleteFeatureRequest({ productId: 9 });

    await action(createFormData({ featureId: 12, productId: 9 }));

    expect(mocks.deleteFeatureRequest).toHaveBeenCalledWith({ featureId: 12 });
    expect(mocks.revalidatePath).toHaveBeenCalledWith("/products/9");
  });

  it("bails when ids are invalid or mismatched", async () => {
    const action = createDeleteFeatureRequest({ productId: 4 });

    await action(createFormData({ featureId: "NaN", productId: 4 }));
    await action(createFormData({ featureId: 1, productId: 99 }));

    expect(mocks.deleteFeatureRequest).not.toHaveBeenCalled();
    expect(mocks.revalidatePath).not.toHaveBeenCalled();
  });

  it("still revalidates even when deletion fails", async () => {
    mocks.deleteFeatureRequest.mockRejectedValueOnce(new Error("fail"));
    const action = createDeleteFeatureRequest({ productId: 3 });

    await action(createFormData({ featureId: 7, productId: 3 }));

    expect(mocks.deleteFeatureRequest).toHaveBeenCalled();
    expect(mocks.revalidatePath).toHaveBeenCalledWith("/products/3");
  });
});
