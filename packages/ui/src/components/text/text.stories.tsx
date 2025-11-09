import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { Text } from "./text";

const meta = {
  args: {
    children: "The quick brown fox jumps over the lazy dog.",
    color: "default",
    size: "md",
    weight: "normal",
  },
  component: Text,
  title: "UI/Text",
} satisfies Meta<typeof Text>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Muted: Story = {
  args: {
    color: "muted",
  },
};

export const Uppercase: Story = {
  args: {
    casing: "uppercase",
    children: "Heading label",
  },
};

export const Accent: Story = {
  args: {
    children: "Accent emphasis",
    color: "accent",
    weight: "semibold",
  },
};

export const RightAligned: Story = {
  args: {
    align: "right",
    children: "Right aligned copy",
    className: "w-full",
    size: "lg",
  },
};

export const Truncated: Story = {
  args: {
    casing: "none",
    children:
      "This sentence is intentionally long to demonstrate how the truncate variant trims overflowing text in constrained layouts.",
    className: "max-w-xs",
    display: "inline-block",
    truncate: true,
  },
};
