import { composeStories } from "@storybook/nextjs-vite";
import { describe, expect, it } from "vitest";
import { render } from "vitest-browser-react";

import { Grid } from "./grid";
import * as stories from "./grid.stories";

const Stories = composeStories(stories);

describe("Grid", () => {
  it.each(Object.entries(Stories))("should %s snapshot", async (_, Story) => {
    const originalInnerHtml = document.body.innerHTML;

    await Story.run();

    await expect(document.body).toMatchScreenshot();

    document.body.innerHTML = originalInnerHtml;
  });

  it("renders a grid layout with default columns and gap", async () => {
    await render(
      <Grid>
        <span>One</span>
        <span>Two</span>
      </Grid>,
    );

    const grid = document.querySelector<HTMLDivElement>('[data-slot="grid"]');
    expect(grid).not.toBeNull();

    const className = grid?.className ?? "";
    expect(className).toContain("grid");
    expect(className).toContain("grid-cols-1");
    expect(className).toContain("gap-4");
  });

  it("supports custom column and row templates as well as flow", async () => {
    await render(
      <Grid columns="3" flow="column" rows="2">
        {[...Array(6)].map((_, index) => (
          <span key={index}>Item {index}</span>
        ))}
      </Grid>,
    );

    const grid = document.querySelector<HTMLDivElement>('[data-slot="grid"]');
    expect(grid).not.toBeNull();

    const className = grid?.className ?? "";
    expect(className).toContain("grid-cols-3");
    expect(className).toContain("grid-rows-2");
    expect(className).toContain("grid-flow-col");
  });

  it("allows inline grid display with alignment options via Slot", async () => {
    await render(
      <Grid align="center" asChild gap="lg" inline justify="between">
        <section>
          <span>One</span>
          <span>Two</span>
        </section>
      </Grid>,
    );

    const section = document.querySelector<HTMLElement>('[data-slot="grid"]');
    expect(section).not.toBeNull();

    const className = section?.className ?? "";
    expect(className).toContain("inline-grid");
    expect(className).toContain("items-center");
    expect(className).toContain("justify-between");
    expect(className).toContain("gap-6");
    expect(section?.tagName).toBe("SECTION");
  });
});
