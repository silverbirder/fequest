import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { Center } from "./center";

const meta = {
  args: {
    children: (
      <span className="rounded bg-primary/10 px-4 py-2">Centered content</span>
    ),
    className: "h-48 border border-dashed border-primary/30",
  },
  component: Center,
  title: "Layout/Center",
} satisfies Meta<typeof Center>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Inline: Story = {
  args: {
    className: "border-none",
    inline: true,
  },
};

export const Column: Story = {
  args: {
    children: (
      <>
        <span className="rounded bg-primary/10 px-4 py-2">First</span>
        <span className="rounded bg-primary/10 px-4 py-2">Second</span>
      </>
    ),
    className: "h-64 border border-dashed border-primary/30",
    direction: "column",
    gap: "lg",
  },
};
