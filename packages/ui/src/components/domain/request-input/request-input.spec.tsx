import type { ReactNode } from "react";
import type { FormStatus } from "react-dom";

import { jaMessages } from "@repo/messages";
import { composeStories } from "@storybook/nextjs-vite";
import { NextIntlClientProvider } from "next-intl";
import { afterEach, describe, expect, it, vi } from "vitest";
import { render } from "vitest-browser-react";

import { RequestInput } from "./request-input";
import * as stories from "./request-input.stories";

const defaultFormStatus: FormStatus = {
  action: null,
  data: null,
  method: null,
  pending: false,
};

const useFormStatusMock = vi.hoisted(() =>
  vi.fn((): FormStatus => defaultFormStatus),
);

vi.mock("react-dom", async () => {
  const actual = await vi.importActual<typeof import("react-dom")>("react-dom");

  return {
    ...actual,
    useFormStatus: useFormStatusMock,
  };
});

const Stories = composeStories(stories);

const renderWithIntl = (ui: ReactNode) =>
  render(
    <NextIntlClientProvider locale="ja" messages={jaMessages}>
      {ui}
    </NextIntlClientProvider>,
  );

describe("RequestInput", () => {
  afterEach(() => {
    useFormStatusMock.mockReset();
    useFormStatusMock.mockImplementation(() => defaultFormStatus);
  });

  it.each(Object.entries(Stories))("should %s screenshot", async (_, Story) => {
    const originalInnerHtml = document.body.innerHTML;

    await Story.run();

    await expect(document.body).toMatchScreenshot();

    document.body.innerHTML = originalInnerHtml;
  });

  it("renders avatar and input with helper text", async () => {
    await renderWithIntl(
      <RequestInput
        avatar={{ fallbackText: "UI" }}
        helperText="入力してください"
        name="request"
      />,
    );

    const avatarFallback = document.querySelector(
      "[data-slot='avatar-fallback']",
    );
    expect(avatarFallback?.textContent).toBe("UI");

    const input = document.querySelector("input[name='request']");
    expect(input).not.toBeNull();

    const helperNodes = Array.from(
      document.querySelectorAll("[data-slot='text']"),
    );
    const helper = helperNodes.find((node) =>
      node.textContent?.includes("入力してください"),
    );
    expect(helper?.textContent).toContain("入力してください");
  });

  it("disables input when form submission is pending", async () => {
    const pendingStatus: FormStatus = {
      action: "",
      data: new FormData(),
      method: "POST",
      pending: true,
    };
    useFormStatusMock.mockImplementation(() => pendingStatus);

    await renderWithIntl(<RequestInput name="request" />);

    const input = document.querySelector("input[name='request']");
    expect(input).toHaveAttribute("disabled");

    const helperNodes = Array.from(
      document.querySelectorAll("[data-slot='text']"),
    );
    const helper = helperNodes.find((node) =>
      node.textContent?.includes(jaMessages.UI.requestInput.loadingHelper),
    );
    expect(helper?.textContent).toContain(
      jaMessages.UI.requestInput.loadingHelper,
    );
  });
});
