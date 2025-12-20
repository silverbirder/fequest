import { describe, expect, it } from "vitest";

import { jaMessages } from "./index";

describe("messages", () => {
  it("exports Japanese messages", () => {
    expect(jaMessages.UserFeatureTop.appName).toBe("Fequest");
  });
});
