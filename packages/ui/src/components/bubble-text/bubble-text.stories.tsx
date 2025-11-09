import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { BubbleText } from "./bubble-text";

const meta = {
  args: {
    children: "BubbleText",
  },
  component: BubbleText,
  title: "UI/BubbleText",
} satisfies Meta<typeof BubbleText>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
