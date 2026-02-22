import { afterEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  redirect: vi.fn(),
  revalidatePath: vi.fn(),
  unwatch: vi.fn(),
  watch: vi.fn(),
}));

vi.mock("~/trpc/server", () => ({
  api: {
    product: {
      unwatch: mocks.unwatch,
      watch: mocks.watch,
    },
  },
}));

vi.mock("next/cache", () => ({
  revalidatePath: mocks.revalidatePath,
}));

vi.mock("next/navigation", () => ({
  redirect: mocks.redirect,
}));

import { createToggleWatchProduct } from "./toggle-watch-product";

const createFormData = (target: string) => {
  const formData = new FormData();
  formData.set("target", target);
  return formData;
};

afterEach(() => {
  vi.clearAllMocks();
  mocks.revalidatePath.mockReset();
  mocks.redirect.mockReset();
  mocks.unwatch.mockReset();
  mocks.watch.mockReset();
});

describe("createToggleWatchProduct", () => {
  it("watches the product and revalidates path", async () => {
    const action = createToggleWatchProduct({ productId: 5 });

    await action(createFormData("watch"));

    expect(mocks.watch).toHaveBeenCalledWith({ id: 5 });
    expect(mocks.unwatch).not.toHaveBeenCalled();
    expect(mocks.revalidatePath).toHaveBeenCalledWith("/5");
  });

  it("unwatches the product and revalidates path", async () => {
    const action = createToggleWatchProduct({ productId: 7 });

    await action(createFormData("unwatch"));

    expect(mocks.unwatch).toHaveBeenCalledWith({ id: 7 });
    expect(mocks.watch).not.toHaveBeenCalled();
    expect(mocks.revalidatePath).toHaveBeenCalledWith("/7");
  });

  it("does nothing on invalid target", async () => {
    const action = createToggleWatchProduct({ productId: 9 });

    await action(createFormData("invalid"));

    expect(mocks.watch).not.toHaveBeenCalled();
    expect(mocks.unwatch).not.toHaveBeenCalled();
    expect(mocks.revalidatePath).not.toHaveBeenCalled();
  });

  it("redirects to setting when watch fails due to missing webhook", async () => {
    mocks.watch.mockRejectedValueOnce(new Error("WEBHOOK_REQUIRED"));
    const action = createToggleWatchProduct({ productId: 10 });

    await action(createFormData("watch"));

    expect(mocks.redirect).toHaveBeenCalledWith("/setting?from=watch");
    expect(mocks.revalidatePath).not.toHaveBeenCalled();
  });
});
