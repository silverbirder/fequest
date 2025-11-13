import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { RequestCard } from "./request-card";

const meta = {
  args: {
    avatar: {
      fallbackText: "NR",
    },
    reactions: [
      { count: 12, emoji: "👍" },
      { count: 5, emoji: "❤️" },
      { count: 3, emoji: "🎉" },
    ],
    text: "コメント機能の追加",
  },
  component: RequestCard,
  title: "UI/RequestCard",
} satisfies Meta<typeof RequestCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
