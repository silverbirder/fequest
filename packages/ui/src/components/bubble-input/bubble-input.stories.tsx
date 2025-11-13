import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { BubbleInput } from "./bubble-input";

const meta = {
  args: {},
  component: BubbleInput,
  title: "UI/BubbleInput",
} satisfies Meta<typeof BubbleInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
