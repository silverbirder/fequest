import { afterEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  revalidatePath: vi.fn(),
  updateDetails: vi.fn(),
}));

vi.mock("~/trpc/server", () => ({
  api: {
    product: {
      updateDetails: mocks.updateDetails,
    },
  },
}));

vi.mock("next/cache", () => ({
  revalidatePath: mocks.revalidatePath,
}));

import { createUpdateProductDetails } from "./update-product-details";

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
  mocks.updateDetails.mockReset();
});

describe("createUpdateProductDetails", () => {
  it("updates details and revalidates path", async () => {
    const action = createUpdateProductDetails({ productId: 4 });

    await action(
      createFormData({
        description: "  Great product  ",
        logoUrl: " https://cdn.example.com/logo.png ",
        productId: 4,
      }),
    );

    expect(mocks.updateDetails).toHaveBeenCalledWith({
      description: "Great product",
      id: 4,
      logoUrl: "https://cdn.example.com/logo.png",
    });
    expect(mocks.revalidatePath).toHaveBeenCalledWith("/products/4");
  });

  it("ignores mismatched product id", async () => {
    const action = createUpdateProductDetails({ productId: 4 });

    await action(
      createFormData({
        description: "Should not update",
        logoUrl: "https://example.com/logo.png",
        productId: 5,
      }),
    );

    expect(mocks.updateDetails).not.toHaveBeenCalled();
    expect(mocks.revalidatePath).not.toHaveBeenCalled();
  });

  it("still revalidates when update fails", async () => {
    mocks.updateDetails.mockRejectedValueOnce(new Error("fail"));
    const action = createUpdateProductDetails({ productId: 2 });

    await action(
      createFormData({
        description: "Any",
        logoUrl: "https://example.com",
        productId: 2,
      }),
    );

    expect(mocks.updateDetails).toHaveBeenCalled();
    expect(mocks.revalidatePath).toHaveBeenCalledWith("/products/2");
  });
});
