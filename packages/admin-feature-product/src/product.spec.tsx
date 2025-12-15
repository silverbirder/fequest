import { composeStories } from "@storybook/nextjs-vite";
import React from "react";
import { describe, expect, it } from "vitest";
import { render } from "vitest-browser-react";

import { Product } from "./product";
import * as stories from "./product.stories";

const Stories = composeStories(stories);

const userDomainUrl = "https://user.example.com";

const flushMicrotasks = async () =>
  await new Promise<void>((resolve) => {
    setTimeout(() => resolve(), 0);
  });

describe("Product", () => {
  it.each(Object.entries(Stories))("should %s snapshot", async (_, Story) => {
    const originalInnerHtml = document.body.innerHTML;

    await Story.run();

    await expect(document.body).toMatchScreenshot();

    document.body.innerHTML = originalInnerHtml;
  });

  it("shows rename form with the current product name", async () => {
    await render(
      <Product
        onDelete={async () => {}}
        onDeleteFeatureRequest={async () => {}}
        onUpdateDetails={async () => {}}
        onUpdateFeatureStatus={async () => {}}
        onUpdateName={async () => {}}
        product={{ featureRequests: [], id: 1, name: "Fequest" }}
        userDomainUrl={userDomainUrl}
      />,
    );

    const nameInput =
      document.querySelector<HTMLInputElement>('input[name="name"]');
    expect(nameInput?.value).toBe("Fequest");

    const renameForm = document.querySelector<HTMLFormElement>(
      'form[data-slot="rename-form"]',
    );
    expect(renameForm?.textContent ?? "").toContain("名前を保存");
  });

  it("focuses the input when its label is clicked", async () => {
    await render(
      <Product
        onDelete={async () => {}}
        onDeleteFeatureRequest={async () => {}}
        onUpdateDetails={async () => {}}
        onUpdateFeatureStatus={async () => {}}
        onUpdateName={async () => {}}
        product={{ featureRequests: [], id: 123, name: "Label Focus" }}
        userDomainUrl={userDomainUrl}
      />,
    );

    const nameLabel = Array.from(
      document.querySelectorAll<HTMLLabelElement>("label"),
    ).find((label) => label.textContent?.trim() === "プロダクト名");
    const nameInput =
      document.querySelector<HTMLInputElement>('input[name="name"]');

    expect(nameLabel).toBeDefined();
    expect(nameInput).toBeDefined();

    nameLabel?.click();

    expect(document.activeElement).toBe(nameInput);
  });

  it("renders product detail form with defaults", async () => {
    await render(
      <Product
        onDelete={async () => {}}
        onDeleteFeatureRequest={async () => {}}
        onUpdateDetails={async () => {}}
        onUpdateFeatureStatus={async () => {}}
        onUpdateName={async () => {}}
        product={{
          description: "Detail text",
          featureRequests: [],
          homePageUrl: "https://example.com",
          id: 9,
          logoUrl: "https://example.com/9.png",
          name: "Detailed",
        }}
        userDomainUrl={userDomainUrl}
      />,
    );

    const logoInput = document.querySelector<HTMLInputElement>(
      'input[name="logoUrl"]',
    );
    expect(logoInput?.value).toBe("https://example.com/9.png");

    const homePageInput = document.querySelector<HTMLInputElement>(
      'input[name="homePageUrl"]',
    );
    expect(homePageInput?.value).toBe("https://example.com");

    const descriptionInput = document.querySelector<HTMLTextAreaElement>(
      'textarea[name="description"]',
    );
    expect(descriptionInput?.value).toBe("Detail text");

    const detailsForm = document.querySelector<HTMLFormElement>(
      'form[data-slot="details-form"]',
    );
    expect(detailsForm?.textContent ?? "").toContain("表示情報を保存");

    const userLink = document.querySelector<HTMLAnchorElement>(
      `a[href="${userDomainUrl}/9"]`,
    );
    expect(userLink?.textContent ?? "").toContain("ユーザー向けページ");
  });

  it("renders feature requests with status toggles", async () => {
    await render(
      <Product
        onDelete={async () => {}}
        onDeleteFeatureRequest={async () => {}}
        onUpdateDetails={async () => {}}
        onUpdateFeatureStatus={async () => {}}
        onUpdateName={async () => {}}
        product={{
          featureRequests: [
            {
              content: "First question",
              createdAt: null,
              id: 10,
              status: "open",
              title: "Alpha",
              updatedAt: null,
            },
            {
              content: "Second question",
              id: 11,
              status: "closed",
              title: "Beta",
            },
          ],
          id: 2,
          name: "Fequest",
        }}
        userDomainUrl={userDomainUrl}
      />,
    );

    const html = document.body.textContent ?? "";
    expect(html).toContain("Alpha");
    expect(html).toContain("Beta");
    expect(html).toContain("完了");
    expect(html).toContain("未完了");

    const openToggle = document.querySelector<HTMLInputElement>(
      'form[data-feature-id="10"] input[name="status"]',
    );
    expect(openToggle?.value).toBe("closed");

    const closedToggle = document.querySelector<HTMLInputElement>(
      'form[data-feature-id="11"] input[name="status"]',
    );
    expect(closedToggle?.value).toBe("open");
  });

  it("shows empty state when there are no feature requests", async () => {
    await render(
      <Product
        onDelete={async () => {}}
        onDeleteFeatureRequest={async () => {}}
        onUpdateDetails={async () => {}}
        onUpdateFeatureStatus={async () => {}}
        onUpdateName={async () => {}}
        product={{ featureRequests: [], id: 3, name: "Empty Product" }}
        userDomainUrl={userDomainUrl}
      />,
    );

    const html = document.body.textContent ?? "";
    expect(html).toContain("まだリクエストがありません。");
  });

  it("renders a destructive delete action with the product id", async () => {
    await render(
      <Product
        onDelete={async () => {}}
        onDeleteFeatureRequest={async () => {}}
        onUpdateDetails={async () => {}}
        onUpdateFeatureStatus={async () => {}}
        onUpdateName={async () => {}}
        product={{ featureRequests: [], id: 7, name: "Deletable" }}
        userDomainUrl={userDomainUrl}
      />,
    );

    const deleteTrigger = Array.from(
      document.querySelectorAll<HTMLButtonElement>("button"),
    ).find((button) => button.textContent?.includes("プロダクトを削除"));

    expect(deleteTrigger).toBeDefined();
    expect(deleteTrigger?.className ?? "").toContain("destructive");

    deleteTrigger?.click();
    await flushMicrotasks();

    const dialog = document.querySelector<HTMLDivElement>(
      '[data-slot="alert-dialog-content"]',
    );
    expect(dialog?.textContent ?? "").toContain("プロダクトを削除");

    const deleteForm = dialog?.querySelector<HTMLFormElement>(
      'form[data-slot="delete-form"]',
    );
    expect(deleteForm).toBeTruthy();

    const hiddenId = deleteForm?.querySelector<HTMLInputElement>(
      'input[name="productId"]',
    );
    expect(hiddenId?.value).toBe("7");

    const confirmButton = deleteForm?.querySelector<HTMLButtonElement>(
      'button[type="submit"]',
    );
    expect(confirmButton?.textContent ?? "").toContain("削除する");
  });

  it("renders a delete button for each feature request with identifiers", async () => {
    await render(
      <Product
        onDelete={async () => {}}
        onDeleteFeatureRequest={async () => {}}
        onUpdateDetails={async () => {}}
        onUpdateFeatureStatus={async () => {}}
        onUpdateName={async () => {}}
        product={{
          featureRequests: [
            { content: "", id: 1, status: "open", title: "First" },
            { content: "", id: 2, status: "closed", title: "Second" },
          ],
          id: 42,
          name: "Fequest",
        }}
        userDomainUrl={userDomainUrl}
      />,
    );

    const deleteTriggers = Array.from(
      document.querySelectorAll<HTMLButtonElement>("button"),
    ).filter((button) => button.textContent?.trim() === "リクエストを削除");

    expect(deleteTriggers).toHaveLength(2);

    deleteTriggers[0]?.click();
    await flushMicrotasks();

    const firstDialogForm = document.querySelector<HTMLFormElement>(
      'form[data-slot="feature-delete-form"][data-feature-id="1"]',
    );
    expect(firstDialogForm).toBeTruthy();
    const firstHidden = firstDialogForm?.querySelector<HTMLInputElement>(
      'input[name="featureId"]',
    );
    const firstProductId = firstDialogForm?.querySelector<HTMLInputElement>(
      'input[name="productId"]',
    );

    expect(firstHidden?.value).toBe("1");
    expect(firstProductId?.value).toBe("42");

    const cancelButton = Array.from(
      document.querySelectorAll<HTMLButtonElement>("button"),
    ).find((button) => button.textContent?.trim() === "キャンセル");
    cancelButton?.click();
    await flushMicrotasks();

    deleteTriggers[1]?.click();
    await flushMicrotasks();

    const secondDialogForm = document.querySelector<HTMLFormElement>(
      'form[data-slot="feature-delete-form"][data-feature-id="2"]',
    );
    expect(secondDialogForm).toBeTruthy();
    const secondHidden = secondDialogForm?.querySelector<HTMLInputElement>(
      'input[name="featureId"]',
    );
    const secondProductId = secondDialogForm?.querySelector<HTMLInputElement>(
      'input[name="productId"]',
    );

    expect(secondHidden?.value).toBe("2");
    expect(secondProductId?.value).toBe("42");
  });
});
