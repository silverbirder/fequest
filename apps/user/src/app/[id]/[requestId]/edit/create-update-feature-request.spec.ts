import { afterEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  redirect: vi.fn(),
  revalidatePath: vi.fn(),
  update: vi.fn(),
}));

vi.mock("~/trpc/server", () => ({
  api: {
    featureRequests: {
      update: mocks.update,
    },
  },
}));

vi.mock("next/cache", () => ({
  revalidatePath: mocks.revalidatePath,
}));

vi.mock("next/navigation", () => ({
  redirect: (...args: unknown[]) => mocks.redirect(...args),
}));

import { createUpdateFeatureRequest } from "./create-update-feature-request";

const createFormData = (fields: Record<string, string>) => {
  const formData = new FormData();
  Object.entries(fields).forEach(([key, value]) => {
    formData.set(key, value);
  });
  return formData;
};

afterEach(() => {
  vi.clearAllMocks();
  mocks.update.mockReset();
  mocks.revalidatePath.mockReset();
  mocks.redirect.mockReset();
});

describe("createUpdateFeatureRequest", () => {
  it("submits trimmed content and revalidates", async () => {
    const action = createUpdateFeatureRequest({ productId: 11 });

    await action(
      createFormData({
        content: "  Details here  ",
        featureId: "3",
        title: "  Updated title  ",
      }),
    );

    expect(mocks.update).toHaveBeenCalledWith({
      content: "Details here",
      id: 3,
      title: "Updated title",
    });
    expect(mocks.revalidatePath).toHaveBeenCalledWith("/11");
    expect(mocks.redirect).toHaveBeenCalledWith("/11?open=3");
  });

  it("bails when featureId is invalid", async () => {
    const action = createUpdateFeatureRequest({ productId: 4 });

    await action(
      createFormData({ content: "ok", featureId: "0", title: "Title" }),
    );

    expect(mocks.update).not.toHaveBeenCalled();
    expect(mocks.revalidatePath).not.toHaveBeenCalled();
    expect(mocks.redirect).not.toHaveBeenCalled();
  });

  it("bails when content is not a string", async () => {
    const action = createUpdateFeatureRequest({ productId: 5 });

    // Simulate missing content
    await action(createFormData({ featureId: "2", title: "Title" }));

    expect(mocks.update).not.toHaveBeenCalled();
    expect(mocks.revalidatePath).not.toHaveBeenCalled();
    expect(mocks.redirect).not.toHaveBeenCalled();
  });

  it("bails when title is missing", async () => {
    const action = createUpdateFeatureRequest({ productId: 6 });

    await action(createFormData({ content: "ok", featureId: "2" }));

    expect(mocks.update).not.toHaveBeenCalled();
    expect(mocks.revalidatePath).not.toHaveBeenCalled();
    expect(mocks.redirect).not.toHaveBeenCalled();
  });

  it("still revalidates when update throws", async () => {
    mocks.update.mockRejectedValueOnce(new Error("boom"));
    const action = createUpdateFeatureRequest({ productId: 7 });

    await action(
      createFormData({ content: "New content", featureId: "8", title: "T" }),
    );

    expect(mocks.update).toHaveBeenCalledWith({
      content: "New content",
      id: 8,
      title: "T",
    });
    expect(mocks.revalidatePath).toHaveBeenCalledWith("/7");
    expect(mocks.redirect).not.toHaveBeenCalled();
  });
});
