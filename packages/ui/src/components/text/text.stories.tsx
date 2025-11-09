import type { Meta, StoryObj } from "@storybook/nextjs";

import { Text } from "./text";

const meta = {
  title: "UI/Text",
  component: Text,
  args: {
    children: "The quick brown fox jumps over the lazy dog.",
    size: "md",
    weight: "normal",
    color: "default",
  },
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
    color: "accent",
    weight: "semibold",
    children: "Accent emphasis",
  },
};

export const RightAligned: Story = {
  args: {
    align: "right",
    className: "w-full",
    size: "lg",
    children: "Right aligned copy",
  },
};

export const Truncated: Story = {
  args: {
    truncate: true,
    casing: "none",
    display: "inline-block",
    children:
      "This sentence is intentionally long to demonstrate how the truncate variant trims overflowing text in constrained layouts.",
    className: "max-w-xs",
  },
};
