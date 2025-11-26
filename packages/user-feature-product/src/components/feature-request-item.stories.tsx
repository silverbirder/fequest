import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { FeatureRequestItem } from "./feature-request-item";

const meta = {
  args: {
    avatar: {
      fallbackText: "FR",
    },
    detail: {
      content: (
        <div>
          <h2>タグ付け機能の追加</h2>
          <p>ユーザーが検索結果をフィルターできるようにしてほしいです。</p>
        </div>
      ),
      createdAt: "2024-11-01T09:00:00.000Z",
      title: "タグ付け機能の追加",
      updatedAt: "2024-11-05T18:30:00.000Z",
    },
    featureId: 1,
    onReactToFeature: async () => {},
    reactions: [
      { count: 5, emoji: "👍", reactedByViewer: true },
      { count: 2, emoji: "🎉", reactedByViewer: false },
      { count: 0, emoji: "❤️", reactedByViewer: false },
      { count: 0, emoji: "🔥", reactedByViewer: false },
      { count: 1, emoji: "💡", reactedByViewer: false },
    ],
    text: "タグ付けができるようにしてほしい",
  },
  component: FeatureRequestItem,
  title: "Feature/User/FeatureRequestItem",
} satisfies Meta<typeof FeatureRequestItem>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
