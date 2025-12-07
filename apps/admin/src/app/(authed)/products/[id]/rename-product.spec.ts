import { afterEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  rename: vi.fn(),
  revalidatePath: vi.fn(),
}));

vi.mock("~/trpc/server", () => ({
  api: {
    product: {
      rename: mocks.rename,
    },
  },
}));

vi.mock("next/cache", () => ({
  revalidatePath: mocks.revalidatePath,
}));

import { createRenameProduct } from "./rename-product";

const createFormData = (fields: Record<string, number | string>) => {
  const formData = new FormData();
  Object.entries(fields).forEach(([key, value]) =>
    formData.set(key, value.toString()),
  );
  return formData;
};

afterEach(() => {
  vi.clearAllMocks();
  mocks.rename.mockReset();
  mocks.revalidatePath.mockReset();
});

describe("createRenameProduct", () => {
  it("submits trimmed name and revalidates the product page", async () => {
    const action = createRenameProduct({ productId: 42 });

    await action(createFormData({ name: "  New Name  ", productId: 42 }));

    expect(mocks.rename).toHaveBeenCalledWith({ id: 42, name: "New Name" });
    expect(mocks.revalidatePath).toHaveBeenCalledWith("/products/42");
  });

  it("bails when the product id does not match", async () => {
    const action = createRenameProduct({ productId: 1 });

    await action(createFormData({ name: "Rename", productId: 2 }));

    expect(mocks.rename).not.toHaveBeenCalled();
    expect(mocks.revalidatePath).not.toHaveBeenCalled();
  });

  it("bails when the trimmed name is empty", async () => {
    const action = createRenameProduct({ productId: 3 });

    await action(createFormData({ name: "   ", productId: 3 }));

    expect(mocks.rename).not.toHaveBeenCalled();
    expect(mocks.revalidatePath).not.toHaveBeenCalled();
  });

  it("still revalidates when rename fails", async () => {
    mocks.rename.mockRejectedValueOnce(new Error("fail"));
    const action = createRenameProduct({ productId: 7 });

    await action(createFormData({ name: "Valid", productId: 7 }));

    expect(mocks.rename).toHaveBeenCalled();
    expect(mocks.revalidatePath).toHaveBeenCalledWith("/products/7");
  });
});
