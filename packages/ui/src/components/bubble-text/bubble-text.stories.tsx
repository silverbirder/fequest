import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { BubbleText } from "./bubble-text";

const meta = {
  component: BubbleText,
  args: {
    children: "BubbleText",
  },
} satisfies Meta<typeof BubbleText>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
