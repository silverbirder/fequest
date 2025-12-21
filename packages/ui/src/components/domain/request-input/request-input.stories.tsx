import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { RequestInput } from "./request-input";

const meta = {
  args: {
    avatar: {
      fallbackText: "NR",
    },
    helperText: "Enterで送信",
    name: "feature-request",
    placeholder: "新しいリクエストを入力...",
  },
  component: RequestInput,
  title: "Domain/RequestInput",
} satisfies Meta<typeof RequestInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Pending: Story = {
  args: {
    disabled: true,
    helperText: "送信中...",
  },
};
