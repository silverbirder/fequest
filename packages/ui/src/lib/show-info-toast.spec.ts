import { beforeEach, describe, expect, it, vi } from "vitest";

import { showInfoToast } from "./show-info-toast";

const toastModule = vi.hoisted(() => ({
  toast: {
    info: vi.fn(),
  },
}));

vi.mock("sonner", () => toastModule);

beforeEach(() => {
  toastModule.toast.info.mockClear();
});

describe("showInfoToast", () => {
  it("shows info toast", () => {
    showInfoToast("message");
    expect(toastModule.toast.info).toHaveBeenCalledWith("message");
  });
});
