import { render } from "vitest-browser-react";
import { expect, it, describe, vi } from "vitest";
import { Button } from "./button";

describe("Button", () => {
  it("renders the label and triggers alert", async () => {
    const alertSpy = vi
      .spyOn(window, "alert")
      .mockImplementation(() => undefined);

    const screen = await render(<Button appName="Admin">Press</Button>);

    const button = screen.getByRole("button", { name: "Press" });

    await button.click();

    expect(alertSpy).toHaveBeenCalledWith("Hello from your Admin app!");

    alertSpy.mockRestore();
  });
});
