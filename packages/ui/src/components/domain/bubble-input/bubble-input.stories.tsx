import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { BubbleInput } from "./bubble-input";

const meta = {
  args: {
    helperText: "Enterで送信",
    name: "feature-request",
    placeholder: "新しいリクエストを入力...",
  },
  component: BubbleInput,
  title: "Domain/BubbleInput",
} satisfies Meta<typeof BubbleInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
