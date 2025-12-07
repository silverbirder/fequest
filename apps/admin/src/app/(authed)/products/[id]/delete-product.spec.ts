import { afterEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  delete: vi.fn(),
  redirect: vi.fn(),
  revalidatePath: vi.fn(),
}));

vi.mock("~/trpc/server", () => ({
  api: {
    product: {
      delete: mocks.delete,
    },
  },
}));

vi.mock("next/cache", () => ({
  revalidatePath: mocks.revalidatePath,
}));

vi.mock("next/navigation", () => ({
  redirect: mocks.redirect,
}));

import { createDeleteProduct } from "./delete-product";

const createFormData = (fields: Record<string, number | string>) => {
  const formData = new FormData();
  Object.entries(fields).forEach(([key, value]) =>
    formData.set(key, value.toString()),
  );
  return formData;
};

afterEach(() => {
  vi.clearAllMocks();
  mocks.delete.mockReset();
  mocks.revalidatePath.mockReset();
  mocks.redirect.mockReset();
});

describe("createDeleteProduct", () => {
  it("deletes the product, revalidates, and redirects", async () => {
    const action = createDeleteProduct({ productId: 9 });

    await action(createFormData({ productId: 9 }));

    expect(mocks.delete).toHaveBeenCalledWith({ id: 9 });
    expect(mocks.revalidatePath).toHaveBeenCalledWith("/");
    expect(mocks.redirect).toHaveBeenCalledWith("/");
  });

  it("bails when the product id does not match", async () => {
    const action = createDeleteProduct({ productId: 2 });

    await action(createFormData({ productId: 3 }));

    expect(mocks.delete).not.toHaveBeenCalled();
    expect(mocks.revalidatePath).not.toHaveBeenCalled();
    expect(mocks.redirect).not.toHaveBeenCalled();
  });

  it("does not redirect when delete fails", async () => {
    mocks.delete.mockRejectedValueOnce(new Error("fail"));
    const action = createDeleteProduct({ productId: 5 });

    await action(createFormData({ productId: 5 }));

    expect(mocks.delete).toHaveBeenCalled();
    expect(mocks.revalidatePath).not.toHaveBeenCalled();
    expect(mocks.redirect).not.toHaveBeenCalled();
  });
});
