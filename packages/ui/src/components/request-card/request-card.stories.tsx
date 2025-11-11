import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { RequestCard } from "./request-card";

const meta = {
  args: {
    avatar: {
      fallbackText: "NR",
    },
    text: "コメント機能の追加",
  },
  component: RequestCard,
  title: "UI/RequestCard",
} satisfies Meta<typeof RequestCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
