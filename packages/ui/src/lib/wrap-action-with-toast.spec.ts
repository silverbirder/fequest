import { beforeEach, describe, expect, it, vi } from "vitest";

import { wrapActionWithToast } from "./wrap-action-with-toast";

type MockToast = {
  error: ReturnType<typeof vi.fn>;
  loading: ReturnType<typeof vi.fn>;
  success: ReturnType<typeof vi.fn>;
};

const toastModule = vi.hoisted(() => {
  const toast: MockToast = {
    error: vi.fn(),
    loading: vi.fn(() => "toast-id"),
    success: vi.fn(),
  };

  return { toast };
}) as { toast: MockToast };

vi.mock("sonner", () => toastModule);

beforeEach(() => {
  Object.values(toastModule.toast).forEach((fn) => fn.mockClear());
});

describe("wrapActionWithToast", () => {
  it("shows success toast when action resolves", async () => {
    const action = vi.fn(async (value: string) => `result:${value}`);
    const wrapped = wrapActionWithToast(action, {
      error: "error",
      loading: "loading",
      success: "success",
    });

    await expect(wrapped("arg")).resolves.toBe("result:arg");

    const { toast } = await import("sonner");
    expect(action).toHaveBeenCalledWith("arg");
    expect(toast.loading).toHaveBeenCalledWith("loading");
    expect(toast.success).toHaveBeenCalledWith("success", { id: "toast-id" });
    expect(toast.error).not.toHaveBeenCalled();
  });

  it("shows error toast and rethrows when action rejects", async () => {
    const action = vi.fn(async () => {
      throw new Error("fail");
    });
    const wrapped = wrapActionWithToast(action, {
      error: "error",
      loading: "loading",
      success: "success",
    });

    await expect(wrapped()).rejects.toThrowError("fail");

    const { toast } = await import("sonner");
    expect(toast.loading).toHaveBeenCalledWith("loading");
    expect(toast.error).toHaveBeenCalledWith("error", { id: "toast-id" });
    expect(toast.success).not.toHaveBeenCalled();
  });

  it("treats NEXT_REDIRECT errors as success", async () => {
    const redirectError = { digest: "NEXT_REDIRECT;123" };
    const action = vi.fn(async () => {
      throw redirectError;
    });
    const wrapped = wrapActionWithToast(action, {
      error: "error",
      loading: "loading",
      success: "success",
    });

    await expect(wrapped()).rejects.toBe(redirectError);

    const { toast } = await import("sonner");
    expect(toast.loading).toHaveBeenCalledWith("loading");
    expect(toast.success).toHaveBeenCalledWith("success", {
      id: "toast-id",
    });
    expect(toast.error).not.toHaveBeenCalled();
  });
});
