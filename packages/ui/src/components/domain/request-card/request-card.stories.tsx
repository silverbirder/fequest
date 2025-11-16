import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { RequestCard } from "./request-card";

const meta = {
  args: {
    avatar: {
      fallbackText: "NR",
    },
    reactions: [
      { count: 12, emoji: "👍", reactedByViewer: true },
      { count: 5, emoji: "❤️", reactedByViewer: false },
      { count: 3, emoji: "🎉", reactedByViewer: false },
    ],
    text: "コメント機能の追加",
  },
  component: RequestCard,
  title: "Domain/RequestCard",
} satisfies Meta<typeof RequestCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
