import { afterEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  delete: vi.fn(),
  redirect: vi.fn(),
  revalidatePath: vi.fn(),
}));

vi.mock("~/trpc/server", () => ({
  api: {
    featureRequests: {
      delete: mocks.delete,
    },
  },
}));

vi.mock("next/cache", () => ({
  revalidatePath: mocks.revalidatePath,
}));

vi.mock("next/navigation", () => ({
  redirect: (...args: unknown[]) => mocks.redirect(...args),
}));

import { createDeleteFeatureRequest } from "./delete-feature-request";

const createFormData = (fields: Record<string, string>) => {
  const formData = new FormData();
  Object.entries(fields).forEach(([key, value]) => {
    formData.set(key, value);
  });
  return formData;
};

afterEach(() => {
  vi.clearAllMocks();
  mocks.delete.mockReset();
  mocks.revalidatePath.mockReset();
  mocks.redirect.mockReset();
});

describe("createDeleteFeatureRequest", () => {
  it("deletes the feature request and revalidates the product page", async () => {
    const action = createDeleteFeatureRequest({ productId: 3 });

    await action(createFormData({ featureId: "5" }));

    expect(mocks.delete).toHaveBeenCalledWith({ id: 5 });
    expect(mocks.revalidatePath).toHaveBeenCalledWith("/3");
    expect(mocks.redirect).toHaveBeenCalledWith("/3");
  });

  it("bails when featureId is invalid", async () => {
    const action = createDeleteFeatureRequest({ productId: 9 });

    await action(createFormData({ featureId: "abc" }));

    expect(mocks.delete).not.toHaveBeenCalled();
    expect(mocks.revalidatePath).not.toHaveBeenCalled();
    expect(mocks.redirect).not.toHaveBeenCalled();
  });

  it("still revalidates when deletion fails", async () => {
    mocks.delete.mockRejectedValueOnce(new Error("boom"));
    const errorSpy = vi
      .spyOn(console, "error")
      .mockImplementation(() => undefined);
    const action = createDeleteFeatureRequest({ productId: 12 });

    await action(createFormData({ featureId: "77" }));

    expect(mocks.delete).toHaveBeenCalledWith({ id: 77 });
    expect(mocks.revalidatePath).toHaveBeenCalledWith("/12");
    expect(mocks.redirect).toHaveBeenCalledWith("/12");
    errorSpy.mockRestore();
  });
});
