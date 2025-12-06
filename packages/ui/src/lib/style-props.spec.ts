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
      opacity: "50",
      shadow: "md",
      shrink: "0",
    });

    expect(className).toContain("flex-auto");
    expect(className).toContain("grow");
    expect(className).toContain("shrink-0");
    expect(className).toContain(
      "flex-auto grow shrink-0 border border-b border-l border-r-0 border-t border-dashed backdrop-blur-sm shadow-md",
    );
    expect(className).toContain("opacity-50");
    expect(className).toContain("border");
    expect(className).toContain("border-dashed");
    expect(className).toContain("border-b");
    expect(className).toContain("border-l");
    expect(className).toContain("border-r-0");
    expect(className).toContain("border-t");
    expect(className).toContain("shadow-md");
    expect(className).toContain("backdrop-blur-sm");
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
      shadow: "sm",
      shrink: "1",
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
      shadow: "sm",
      shrink: "1",
    });
    expect(restProps).toEqual({ id: "demo" });
  });
});
