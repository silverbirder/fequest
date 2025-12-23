import { jaMessages } from "@repo/messages";
import { describe, expect, it } from "vitest";

import { metadata } from "./page";

describe("setting metadata", () => {
  it("uses setting title and description", () => {
    const appName = jaMessages.UserFeatureTop.appName;
    const settingTitle = jaMessages.UserSetting.title;

    expect(metadata.title).toBe(`${settingTitle} | ${appName}`);
    expect(metadata.description).toBe(jaMessages.UserSetting.description);
  });
});
