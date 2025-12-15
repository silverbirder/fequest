import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { Product } from "./product";

const meta = {
  args: {
    onDelete: async () => {},
    onDeleteFeatureRequest: async () => {},
    onUpdateDetails: async () => {},
    onUpdateFeatureStatus: async () => {},
    onUpdateName: async () => {},
    product: {
      description: "フィーチャー要望をまとめる管理画面です。",
      featureRequests: [
        {
          content: "ユーザーから寄せられた最初の質問です。",
          createdAt: "2024-01-01T00:00:00.000Z",
          id: 1,
          reactionSummaries: [
            { count: 10, emoji: "👍", reactedByViewer: false },
            { count: 2, emoji: "🎉", reactedByViewer: true },
          ],
          status: "open",
          title: "アルファ版での改善点",
          updatedAt: "2024-01-10T12:30:00.000Z",
          user: {
            image: "https://example.com/avatar/alice.png",
            name: "Alice",
          },
        },
        {
          content: "完了済みの質問。クローズ扱いです。",
          createdAt: "2024-02-05T09:00:00.000Z",
          id: 2,
          reactionSummaries: [
            { count: 1, emoji: "❤️", reactedByViewer: false },
          ],
          status: "closed",
          title: "通知機能はありますか？",
          updatedAt: "2024-02-08T15:45:00.000Z",
          user: {
            image: "https://example.com/avatar/bob.png",
            name: "Bob",
          },
        },
      ],
      homePageUrl: "https://example.com",
      id: 99,
      logoUrl: "https://example.com/logo.svg",
      name: "Fequest Admin",
    },
    userDomainUrl: "https://user.fequest.dev",
  },
  component: Product,
  title: "Feature/Admin/Product",
} satisfies Meta<typeof Product>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const EmptyFeatures: Story = {
  args: {
    onDelete: async () => {},
    onDeleteFeatureRequest: async () => {},
    onUpdateDetails: async () => {},
    product: { featureRequests: [], id: 1, name: "Empty Product" },
    userDomainUrl: "https://user.fequest.dev",
  },
};
