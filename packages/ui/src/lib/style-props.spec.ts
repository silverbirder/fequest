import { describe, expect, it } from "vitest";

import { splitStyleProps, stylePropsClassNames } from "./style-props";

describe("style-props", () => {
  it("applies flex growth and basis utilities", () => {
    const className = stylePropsClassNames({
      backdrop: "sm",
      basis: "1/2",
      border: "dashed",
      borderBottom: "dotted",
      borderLeft: "default",
      borderRight: "none",
      borderTop: "dashed",
      flex: "auto",
      grow: "1",
      maxH: "screen",
      maxW: "lg",
      minW: "0",
      opacity: "50",
      overflow: "hidden",
      overflowX: "auto",
      overflowY: "scroll",
      shadow: "md",
      shrink: "0",
      zIndex: "50",
    });

    expect(className).toContain("flex-auto");
    expect(className).toContain("grow");
    expect(className).toContain("shrink-0");
    expect(className).toContain("max-h-screen");
    expect(className).toContain("max-w-lg");
    expect(className).toContain("min-w-0");
    expect(className).toContain("overflow-hidden");
    expect(className).toContain("overflow-x-auto");
    expect(className).toContain("overflow-y-scroll");
    expect(className).toContain("opacity-50");
    expect(className).toContain("border");
    expect(className).toContain("border-dashed");
    expect(className).toContain("border-b");
    expect(className).toContain("border-l");
    expect(className).toContain("border-r-0");
    expect(className).toContain("border-t");
    expect(className).toContain("shadow-md");
    expect(className).toContain("backdrop-blur-sm");
    expect(className).toContain("z-50");
  });

  it("supports gap and negative positioning", () => {
    const className = stylePropsClassNames({
      bottom: "-2",
      display: "flex",
      gap: "2xl",
      position: "absolute",
      right: "-8",
    });

    expect(className).toContain("flex");
    expect(className).toContain("gap-8");
    expect(className).toContain("absolute");
    expect(className).toContain("-bottom-2");
    expect(className).toContain("-right-8");
  });

  it("splits new style props from the rest", () => {
    const { restProps, styleProps } = splitStyleProps({
      backdrop: "lg",
      basis: "full",
      border: "none",
      borderBottom: "default",
      borderLeft: "default",
      borderRight: "default",
      borderTop: "default",
      flex: "1",
      grow: "0",
      id: "demo",
      maxH: "full",
      maxW: "md",
      minW: "full",
      overflow: "visible",
      overflowX: "hidden",
      overflowY: "auto",
      shadow: "sm",
      shrink: "1",
      zIndex: "10",
    });

    expect(styleProps).toEqual({
      backdrop: "lg",
      basis: "full",
      border: "none",
      borderBottom: "default",
      borderLeft: "default",
      borderRight: "default",
      borderTop: "default",
      flex: "1",
      grow: "0",
      maxH: "full",
      maxW: "md",
      minW: "full",
      overflow: "visible",
      overflowX: "hidden",
      overflowY: "auto",
      shadow: "sm",
      shrink: "1",
      zIndex: "10",
    });
    expect(restProps).toEqual({ id: "demo" });
  });
});
