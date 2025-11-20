import { describe, expect, it } from "vitest";
import { render } from "vitest-browser-react";

import { RequestCard } from "./request-card";

describe("RequestCard", () => {
  it("renders provided children", async () => {
    await render(
      <RequestCard
        avatar={{ fallbackText: "CF" }}
        detail={{
          content: "Detailed content",
          createdAt: "2024-01-01T00:00:00.000Z",
          title: "Child content",
          updatedAt: "2024-01-02T00:00:00.000Z",
        }}
        text="Child content"
      />,
    );

    const element = document.querySelector("div");
    expect(element).not.toBeNull();
    expect(element?.textContent ?? "").toContain("Child content");
    expect(element?.textContent ?? "").toContain("CF");
  });
});
