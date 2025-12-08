import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { FeatureRequestContent } from "./feature-request-content";
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
    editHref: { pathname: "/1/1/edit" },
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

export const OwnedByAuthor: Story = {
  args: {
    avatar: {
      fallbackText: "ME",
      image: "https://api.dicebear.com/7.x/initials/svg?seed=ME",
    },
    detail: {
      content: (
        <FeatureRequestContent
          content={`## 自分のリクエスト\n\n- フィードバック用のスクリーンショットを追加\n- 通知設定をデフォルトで有効化\n- 週次でのステータス更新を希望`}
        />
      ),
      createdAt: "2024-12-01T09:00:00.000Z",
      title: "自分のリクエスト",
      updatedAt: "2024-12-06T07:45:00.000Z",
    },
    editHref: { pathname: "/product/1/feature/1/edit" },
    featureId: 1,
    onReactToFeature: async () => {},
    reactions: [
      { count: 8, emoji: "👍", reactedByViewer: true },
      { count: 3, emoji: "🎉", reactedByViewer: false },
      { count: 1, emoji: "💡", reactedByViewer: false },
    ],
    text: "通知設定をデフォルトで有効にしたい",
  },
};
