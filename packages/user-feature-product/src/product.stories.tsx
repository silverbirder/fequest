import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { Product } from "./product";

const meta = {
  args: {
    canCreateFeatureRequest: true,
    currentUser: {
      id: "owner-1",
      image: "https://placehold.co/48x48",
      name: "田中 花子",
    },
    onCreateFeatureRequest: async (formData: FormData) => {
      console.log("Created feature request", {
        title: formData.get("title"),
      });
    },
    onReactToFeature: async (formData: FormData) => {
      console.log("Reacted to feature", {
        action: formData.get("action"),
        emoji: formData.get("emoji"),
        id: formData.get("featureId"),
      });
    },
    onToggleWatchProduct: async (formData: FormData) => {
      console.log("Toggled product watch", {
        target: formData.get("target"),
      });
    },
    product: {
      description: "ユーザーからのアイデアや改善要望を集めるプロダクトです。",
      featureRequests: [
        {
          content: "ユーザーがプロフィール画像をアップロードできるようにする",
          id: 1,
          reactionSummaries: [
            { count: 2, emoji: "👍", reactedByViewer: true },
            { count: 1, emoji: "🎉", reactedByViewer: true },
          ],
          status: "open",
          title: "プロフィール画像アップロード",
          user: {
            id: "owner-1",
            image: "https://placehold.co/48x48",
            name: "田中 花子",
          },
        },
        {
          content: "管理者向けダッシュボードにフィルタリング機能を追加",
          id: 2,
          reactionSummaries: [
            { count: 1, emoji: "✅", reactedByViewer: false },
          ],
          status: "closed",
          title: "管理ダッシュボードのフィルター",
          user: {
            id: "other-user",
            image: "https://placehold.co/48x48",
            name: "佐藤 健",
          },
        },
      ],
      homePageUrl: "https://example.com",
      id: 1,
      logoUrl: "https://placehold.co/120x120",
      name: "サンプルプロダクト",
    },
    viewerIsWatching: false,
  },
  component: Product,
  title: "Feature/User/Product",
} satisfies Meta<typeof Product>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
