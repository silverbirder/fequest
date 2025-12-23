import { jaMessages } from "@repo/messages";
import { describe, expect, it } from "vitest";

import { metadata } from "./page";

describe("home metadata", () => {
  it("uses the top hero tagline", () => {
    expect(metadata.title).toBe(jaMessages.UserFeatureTop.appName);
    expect(metadata.description).toBe(jaMessages.UserFeatureTop.hero.tagline);
  });
});
