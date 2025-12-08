import { composeStories } from "@storybook/nextjs-vite";
import { describe, expect, it } from "vitest";
import { render } from "vitest-browser-react";

import { RequestEdit } from "./request-edit";
import * as stories from "./request-edit.stories";

const Stories = composeStories(stories);

describe("RequestEdit", () => {
  it.each(Object.entries(Stories))("should %s snapshot", async (_, Story) => {
    const originalInnerHtml = document.body.innerHTML;

    await Story.run();

    await expect(document.body).toMatchScreenshot();

    document.body.innerHTML = originalInnerHtml;
  });

  it("renders form fields with defaults", async () => {
    await render(
      <RequestEdit
        backHref={{ pathname: "/products/1" }}
        defaultValues={{ content: "内容", title: "タイトル" }}
        featureId={12}
        onSubmit={async () => {}}
        productName="Fequest"
      />,
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
});
