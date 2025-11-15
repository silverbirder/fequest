import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { Heading } from "./heading";

const meta = {
  args: {
    children: "Page Title",
    level: 2,
    weight: "bold",
  },
  component: Heading,
  title: "Typography/Heading",
} satisfies Meta<typeof Heading>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Level1: Story = {
  args: {
    children: "Hero Title",
    level: 1,
  },
};

export const Level2: Story = {
  args: {
    children: "Page Title",
    level: 2,
  },
};

export const Level3: Story = {
  args: {
    children: "Section Heading",
    level: 3,
    weight: "semibold",
  },
};

export const Level4: Story = {
  args: {
    children: "Section Title",
    level: 4,
    weight: "semibold",
  },
};

export const Level5: Story = {
  args: {
    children: "Subsection Heading",
    level: 5,
    weight: "medium",
  },
};

export const Underlined: Story = {
  args: {
    children: "Underlined Heading",
    underline: true,
  },
};

export const CenterAligned: Story = {
  args: {
    align: "center",
    children: "Centered Headline",
    level: 2,
  },
};

export const Truncated: Story = {
  args: {
    children:
      "A very long heading that illustrates how truncation behaves when the available space is limited within a layout",
    className: "max-w-md",
    level: 3,
    truncate: true,
  },
};
