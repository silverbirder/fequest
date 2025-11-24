import React from "react";
import { describe, expect, it } from "vitest";
import { render } from "vitest-browser-react";

import { Product } from "./product";

describe("Product", () => {
  it("shows rename form with the current product name", async () => {
    await render(
      <Product
        onUpdateFeatureStatus={async () => {}}
        onUpdateName={async () => {}}
        product={{ featureRequests: [], id: 1, name: "Fequest" }}
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

  it("renders feature requests with status toggles", async () => {
    await render(
      <Product
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
      />,
    );

    const html = document.body.textContent ?? "";
    expect(html).toContain("Alpha");
    expect(html).toContain("Beta");
    expect(html).toContain("オープン");
    expect(html).toContain("クローズ");

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
        onUpdateFeatureStatus={async () => {}}
        onUpdateName={async () => {}}
        product={{ featureRequests: [], id: 3, name: "Empty Product" }}
      />,
    );

    const html = document.body.textContent ?? "";
    expect(html).toContain("まだ質問がありません。");
  });
});
