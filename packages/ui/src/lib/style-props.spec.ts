import { describe, expect, it } from "vitest";

import { splitStyleProps, stylePropsClassNames } from "./style-props";

describe("style-props", () => {
  it("applies flex growth and basis utilities", () => {
    const className = stylePropsClassNames({
      basis: "1/2",
      border: "dashed",
      flex: "auto",
      grow: "1",
      shrink: "0",
    });

    expect(className).toContain("flex-auto");
    expect(className).toContain("grow");
    expect(className).toContain("shrink-0");
    expect(className).toContain("flex-auto grow shrink-0 border border-dashed");
    expect(className).toContain("border");
    expect(className).toContain("border-dashed");
  });

  it("splits new style props from the rest", () => {
    const { restProps, styleProps } = splitStyleProps({
      basis: "full",
      border: "none",
      flex: "1",
      grow: "0",
      id: "demo",
      shrink: "1",
    });

    expect(styleProps).toEqual({
      basis: "full",
      border: "none",
      flex: "1",
      grow: "0",
      shrink: "1",
    });
    expect(restProps).toEqual({ id: "demo" });
  });
});
