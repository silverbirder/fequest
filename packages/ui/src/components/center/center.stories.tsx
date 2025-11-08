import type { Meta, StoryObj } from "@storybook/nextjs";

import { Center } from "./center";

const meta = {
  title: "Layout/Center",
  component: Center,
  args: {
    className: "h-48 border border-dashed border-primary/30",
    children: (
      <span className="rounded bg-primary/10 px-4 py-2">Centered content</span>
    ),
  },
} satisfies Meta<typeof Center>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Inline: Story = {
  args: {
    inline: true,
    className: "border-none",
  },
};

export const Column: Story = {
  args: {
    direction: "column",
    spacing: "lg",
    className: "h-64 border border-dashed border-primary/30",
    children: (
      <>
        <span className="rounded bg-primary/10 px-4 py-2">First</span>
        <span className="rounded bg-primary/10 px-4 py-2">Second</span>
      </>
    ),
  },
};
