import { cn } from "@repo/ui/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";

const background = cva("", {
  variants: {
    bg: {
      accent: "bg-accent",
      background: "bg-background",
      black: "bg-black",
      card: "bg-card",
      destructive: "bg-destructive",
      "gray-50": "bg-gray-50",
      "gray-100": "bg-gray-100",
      "gray-200": "bg-gray-200",
      "gray-300": "bg-gray-300",
      muted: "bg-muted",
      none: undefined,
      popover: "bg-popover",
      primary: "bg-primary",
      "primary-subtle": "bg-primary/10",
      secondary: "bg-secondary",
      transparent: "bg-transparent",
      white: "bg-white",
    },
  },
});

const foreground = cva("", {
  variants: {
    color: {
      accent: "text-primary",
      default: undefined,
      destructive: "text-destructive",
      inverse: "text-background",
      muted: "text-muted-foreground",
      "on-accent": "text-accent-foreground",
      "on-destructive": "text-destructive-foreground",
      "on-primary": "text-primary-foreground",
      "on-secondary": "text-secondary-foreground",
      subtle: "text-foreground/80",
    },
  },
});

const radius = cva("", {
  variants: {
    radius: {
      "2xl": "rounded-2xl",
      full: "rounded-full",
      lg: "rounded-lg",
      md: "rounded-md",
      none: "rounded-none",
      sm: "rounded-sm",
      xl: "rounded-xl",
      xs: "rounded-xs",
    },
  },
});

const spacing = cva("", {
  variants: {
    p: {
      "2xl": "p-8",
      lg: "p-4",
      md: "p-3",
      none: "p-0",
      sm: "p-2",
      xl: "p-6",
      xs: "p-1",
    },
    pb: {
      "2xl": "pb-8",
      lg: "pb-4",
      md: "pb-3",
      none: "pb-0",
      sm: "pb-2",
      xl: "pb-6",
      xs: "pb-1",
    },
    pl: {
      "2xl": "pl-8",
      lg: "pl-4",
      md: "pl-3",
      none: "pl-0",
      sm: "pl-2",
      xl: "pl-6",
      xs: "pl-1",
    },
    pr: {
      "2xl": "pr-8",
      lg: "pr-4",
      md: "pr-3",
      none: "pr-0",
      sm: "pr-2",
      xl: "pr-6",
      xs: "pr-1",
    },
    pt: {
      "2xl": "pt-8",
      lg: "pt-4",
      md: "pt-3",
      none: "pt-0",
      sm: "pt-2",
      xl: "pt-6",
      xs: "pt-1",
    },
    px: {
      "2xl": "px-8",
      lg: "px-4",
      md: "px-3",
      none: "px-0",
      sm: "px-2",
      xl: "px-6",
      xs: "px-1",
    },
    py: {
      "2xl": "py-8",
      lg: "py-4",
      md: "py-3",
      none: "py-0",
      sm: "py-2",
      xl: "py-6",
      xs: "py-1",
    },
  },
});

const layout = cva("", {
  variants: {
    h: {
      "3": "h-3",
      auto: "h-auto",
      fit: "h-fit",
      full: "h-full",
      max: "h-max",
      min: "h-min",
    },
    left: {
      "-1": "-left-1",
    },
    position: {
      absolute: "absolute",
      fixed: "fixed",
      relative: "relative",
      static: "static",
      sticky: "sticky",
    },
    rotate: {
      "45": "rotate-45",
    },
    top: {
      "1/2": "top-1/2",
    },
    translateY: {
      "-1/2": "-translate-y-1/2",
    },
    w: {
      "3": "w-3",
      auto: "w-auto",
      fit: "w-fit",
      full: "w-full",
      max: "w-max",
      min: "w-min",
    },
  },
});

const caret = cva("", {
  variants: {
    caret: {
      auto: "caret-auto",
      current: "caret-current",
      inherit: "caret-inherit",
      transparent: "caret-transparent",
    },
  },
});

type BackgroundProps = VariantProps<typeof background>;
type CaretProps = VariantProps<typeof caret>;
type ForegroundProps = VariantProps<typeof foreground>;
type LayoutProps = VariantProps<typeof layout>;
type RadiusProps = VariantProps<typeof radius>;
type SpacingProps = VariantProps<typeof spacing>;

type StyleProps = BackgroundProps &
  CaretProps &
  ForegroundProps &
  LayoutProps &
  RadiusProps &
  SpacingProps;

const stylePropsClassNames = (props?: Partial<StyleProps>) =>
  cn(
    background(props ?? {}),
    foreground(props ?? {}),
    radius(props ?? {}),
    spacing(props ?? {}),
    layout(props ?? {}),
    caret(props ?? {}),
  );

const stylePropKeys = [
  "bg",
  "color",
  "p",
  "px",
  "py",
  "pt",
  "pr",
  "pb",
  "pl",
  "radius",
  "position",
  "w",
  "h",
  "top",
  "left",
  "translateY",
  "rotate",
  "caret",
] as const;

type StylePropKey = (typeof stylePropKeys)[number];

const stylePropKeySet = new Set<string>(stylePropKeys);

const splitStyleProps = <Props extends Record<string, unknown>>(
  props: Props,
) => {
  const styleProps: Record<string, unknown> = {};
  const restProps: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(props)) {
    if (stylePropKeySet.has(key)) {
      styleProps[key] = value;
    } else {
      restProps[key] = value;
    }
  }

  return {
    restProps: restProps as Omit<Props, StylePropKey>,
    styleProps: styleProps as Partial<StyleProps>,
  };
};

export {
  background,
  caret,
  foreground,
  layout,
  radius,
  spacing,
  splitStyleProps,
  stylePropsClassNames,
};

export type {
  BackgroundProps,
  CaretProps,
  ForegroundProps,
  LayoutProps,
  RadiusProps,
  SpacingProps,
  StylePropKey,
  StyleProps,
};
