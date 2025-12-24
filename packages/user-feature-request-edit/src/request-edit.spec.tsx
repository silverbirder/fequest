import { jaMessages } from "@repo/messages";
import { composeStories } from "@storybook/nextjs-vite";
import { NextIntlClientProvider } from "next-intl";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { render } from "vitest-browser-react";

import { RequestEdit } from "./request-edit";
import * as stories from "./request-edit.stories";

const Stories = composeStories(stories);

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

  return {
    toast,
    Toaster: () => null,
  };
}) as { toast: MockToast; Toaster: () => null };

vi.mock("sonner", () => toastModule);

const waitForDialog = () =>
  new Promise<void>((resolve) => {
    requestAnimationFrame(() => resolve());
  });

beforeEach(() => {
  Object.values(toastModule.toast).forEach((fn) => fn.mockClear());
  document.body.innerHTML = "";
});

describe("RequestEdit", () => {
  it.each(Object.entries(Stories))("should %s snapshot", async (_, Story) => {
    const originalInnerHtml = document.body.innerHTML;

    await Story.run();

    await expect(document.body).toMatchScreenshot();

    document.body.innerHTML = originalInnerHtml;
  });

  it("renders form fields with defaults", async () => {
    await render(
      <NextIntlClientProvider locale="ja" messages={jaMessages}>
        <RequestEdit
          backHref={{ pathname: "/products/1" }}
          defaultValues={{ content: "内容", title: "タイトル" }}
          featureId={12}
          onSubmit={async () => {}}
          productName="Fequest"
        />
      </NextIntlClientProvider>,
    );

    const titleInput = document.querySelector<HTMLInputElement>(
      "input[name='title']",
    );
    expect(titleInput?.value).toBe("タイトル");

    const contentTextarea = document.querySelector<HTMLTextAreaElement>(
      "textarea[name='content']",
    );
    expect(contentTextarea?.value).toBe("内容");

    const hiddenId = document.querySelector<HTMLInputElement>(
      "input[name='featureId']",
    );
    expect(hiddenId?.value).toBe("12");
  });

  it("asks for confirmation before deleting", async () => {
    const onDelete = vi.fn(async () => {});

    await render(
      <NextIntlClientProvider locale="ja" messages={jaMessages}>
        <RequestEdit
          backHref={{ pathname: "/products/1" }}
          defaultValues={{ content: "内容", title: "タイトル" }}
          featureId={34}
          onDelete={onDelete}
          onSubmit={async () => {}}
          productName="Fequest"
        />
      </NextIntlClientProvider>,
    );

    const deleteTrigger = Array.from(
      document.querySelectorAll<HTMLButtonElement>("button"),
    ).find((button) =>
      button.textContent?.includes(
        jaMessages.UserFeatureRequestEdit.buttons.delete,
      ),
    );

    expect(deleteTrigger).toBeDefined();

    deleteTrigger?.click();
    await waitForDialog();

    const dialogContent = document.querySelector(
      "[data-slot='alert-dialog-content']",
    );
    expect(dialogContent?.textContent).toContain(
      jaMessages.UserFeatureRequestEdit.deleteDialog.title,
    );

    const form = document.querySelector<HTMLFormElement>(
      "[data-slot='alert-dialog-content'] form",
    );

    expect(form).toBeDefined();

    form?.requestSubmit();
    await waitForDialog();

    expect(toastModule.toast.loading).toHaveBeenCalledWith(
      jaMessages.UserFeatureRequestEdit.toast.delete.loading,
    );
    expect(onDelete).toHaveBeenCalledOnce();
  });
});
