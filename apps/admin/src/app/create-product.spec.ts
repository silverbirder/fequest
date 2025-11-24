import { afterEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  create: vi.fn(),
  redirect: vi.fn(),
  revalidatePath: vi.fn(),
}));

vi.mock("~/trpc/server", () => ({
  api: {
    product: {
      create: mocks.create,
    },
  },
}));

vi.mock("next/cache", () => ({
  revalidatePath: mocks.revalidatePath,
}));

vi.mock("next/navigation", () => ({
  redirect: mocks.redirect,
}));

import { createProduct } from "./create-product";

const buildFormData = (name: null | string) => {
  const formData = new FormData();
  if (name !== null) {
    formData.set("name", name);
  }
  return formData;
};

afterEach(() => {
  vi.clearAllMocks();
  mocks.create.mockReset();
  mocks.revalidatePath.mockReset();
  mocks.redirect.mockReset();
});

describe("createProduct", () => {
  it("creates a product, revalidates, and redirects to the new page", async () => {
    mocks.create.mockResolvedValueOnce({ id: 12, name: "New Product" });

    await createProduct(buildFormData("  New Product  "));

    expect(mocks.create).toHaveBeenCalledWith({ name: "New Product" });
    expect(mocks.revalidatePath).toHaveBeenCalledWith("/");
    expect(mocks.redirect).toHaveBeenCalledWith("/products/12");
  });

  it("ignores submissions with empty names", async () => {
    await createProduct(buildFormData("   "));

    expect(mocks.create).not.toHaveBeenCalled();
    expect(mocks.redirect).not.toHaveBeenCalled();
  });

  it("throws when creation fails", async () => {
    mocks.create.mockRejectedValueOnce(new Error("fail"));

    await expect(createProduct(buildFormData("Valid"))).rejects.toThrow("fail");

    expect(mocks.redirect).not.toHaveBeenCalled();
    expect(mocks.revalidatePath).not.toHaveBeenCalled();
  });
});
