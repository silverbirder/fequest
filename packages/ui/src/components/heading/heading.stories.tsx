import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { Heading } from "./heading";

const meta = {
  title: "UI/Heading",
  component: Heading,
  args: {
    children: "Page Title",
    level: 2,
    weight: "bold",
  },
} satisfies Meta<typeof Heading>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Level1: Story = {
  args: {
    level: 1,
    children: "Hero Title",
  },
};

export const Level2: Story = {
  args: {
    level: 2,
    children: "Page Title",
  },
};

export const Level3: Story = {
  args: {
    level: 3,
    weight: "semibold",
    children: "Section Heading",
  },
};

export const Level4: Story = {
  args: {
    level: 4,
    weight: "semibold",
    children: "Section Title",
  },
};

export const Level5: Story = {
  args: {
    level: 5,
    weight: "medium",
    children: "Subsection Heading",
  },
};

export const Underlined: Story = {
  args: {
    underline: true,
    children: "Underlined Heading",
  },
};

export const CenterAligned: Story = {
  args: {
    align: "center",
    level: 2,
    children: "Centered Headline",
  },
};

export const Truncated: Story = {
  args: {
    truncate: true,
    level: 3,
    className: "max-w-md",
    children:
      "A very long heading that illustrates how truncation behaves when the available space is limited within a layout",
  },
};
