import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { Button } from "./button";

const meta = {
  args: { children: "Button", size: "default", variant: "default" },
  component: Button,
  title: "Common/Shadcn/Button",
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Destructive: Story = {
  args: {
    variant: "destructive",
  },
};

export const Ghost: Story = {
  args: {
    variant: "ghost",
  },
};

export const Link: Story = {
  args: {
    variant: "link",
  },
};

export const Outline: Story = {
  args: {
    variant: "outline",
  },
};

export const Secondary: Story = {
  args: {
    variant: "secondary",
  },
};

export const StyleProps: Story = {
  args: {
    radius: "full",
    w: "full",
  },
};
