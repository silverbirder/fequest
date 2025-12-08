import { describe, expect, it } from "vitest";
import { render } from "vitest-browser-react";

import { FeatureRequestContent } from "./feature-request-content";

describe("FeatureRequestContent", () => {
  it("renders read-only content", async () => {
    await render(<FeatureRequestContent content="Hello **MDX**" />);

    const textarea = document.querySelector("textarea");
    expect(textarea).not.toBeNull();
    expect(textarea?.readOnly).toBe(true);
    expect(textarea?.value).toBe("Hello **MDX**");
    expect(textarea?.getAttribute("aria-label")).toBe("機能リクエストの内容");
  });
});
