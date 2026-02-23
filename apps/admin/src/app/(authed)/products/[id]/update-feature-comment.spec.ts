import { afterEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  revalidatePath: vi.fn(),
  updateFeatureComment: vi.fn(),
}));

vi.mock("~/trpc/server", () => ({
  api: {
    product: {
      updateFeatureComment: mocks.updateFeatureComment,
    },
  },
}));

vi.mock("next/cache", () => ({
  revalidatePath: mocks.revalidatePath,
}));

import { createUpdateFeatureComment } from "./update-feature-comment";

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
  mocks.updateFeatureComment.mockReset();
});

describe("createUpdateFeatureComment", () => {
  it("updates feature comment and revalidates path", async () => {
    const action = createUpdateFeatureComment({ productId: 4 });

    await action(
      createFormData({
        comment: "  次のスプリントで対応します  ",
        featureId: 12,
      }),
    );

    expect(mocks.updateFeatureComment).toHaveBeenCalledWith({
      comment: "次のスプリントで対応します",
      featureId: 12,
    });
    expect(mocks.revalidatePath).toHaveBeenCalledWith("/products/4");
  });

  it("bails out when input is invalid", async () => {
    const action = createUpdateFeatureComment({ productId: 4 });

    await action(
      createFormData({
        comment: "x",
        featureId: 0,
      }),
    );

    expect(mocks.updateFeatureComment).not.toHaveBeenCalled();
    expect(mocks.revalidatePath).not.toHaveBeenCalled();
  });

  it("still revalidates when update fails", async () => {
    mocks.updateFeatureComment.mockRejectedValueOnce(new Error("fail"));
    const action = createUpdateFeatureComment({ productId: 9 });

    await action(
      createFormData({
        comment: "ok",
        featureId: 6,
      }),
    );

    expect(mocks.updateFeatureComment).toHaveBeenCalled();
    expect(mocks.revalidatePath).toHaveBeenCalledWith("/products/9");
  });
});
