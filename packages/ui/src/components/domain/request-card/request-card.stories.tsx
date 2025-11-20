import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { RequestCard } from "./request-card";

const meta = {
  args: {
    avatar: {
      fallbackText: "NR",
    },
    detail: {
      content: "ユーザーが通知をまとめて確認できるようにして欲しいです。",
      createdAt: "2024-12-01T10:00:00.000Z",
      title: "コメント機能の追加",
      updatedAt: "2024-12-05T08:45:00.000Z",
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
