import { jaMessages } from "@repo/messages";
import { NextIntlClientProvider } from "next-intl";
import { describe, expect, it } from "vitest";
import { render } from "vitest-browser-react";

import { FeatureRequestContent } from "./feature-request-content";

describe("FeatureRequestContent", () => {
  it("renders read-only content", async () => {
    await render(
      <NextIntlClientProvider locale="ja" messages={jaMessages}>
        <FeatureRequestContent content="Hello **MDX**" />
      </NextIntlClientProvider>,
    );

    const textarea = document.querySelector("textarea");
    expect(textarea).not.toBeNull();
    expect(textarea?.readOnly).toBe(true);
    expect(textarea?.value).toBe("Hello **MDX**");
    expect(textarea?.getAttribute("aria-label")).toBe(
      jaMessages.UserFeatureProduct.requestContentAriaLabel,
    );
  });
});
