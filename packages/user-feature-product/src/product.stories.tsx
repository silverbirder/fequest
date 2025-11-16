import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { Product } from "./product";

const meta = {
  args: {
    canCreateFeatureRequest: true,
    onCreateFeatureRequest: async (formData: FormData) => {
      console.log("Created feature request", {
        content: formData.get("content"),
      });
    },
    onReactToFeature: async (formData: FormData) => {
      console.log("Reacted to feature", {
        action: formData.get("action"),
        emoji: formData.get("emoji"),
        id: formData.get("featureId"),
      });
    },
    product: {
      featureRequests: [
        {
          content: "ユーザーがプロフィール画像をアップロードできるようにする",
          id: 1,
          reactionSummaries: [
            { count: 2, emoji: "👍", reactedByViewer: true },
            { count: 1, emoji: "🎉", reactedByViewer: true },
          ],
          status: "open",
        },
        {
          content: "管理者向けダッシュボードにフィルタリング機能を追加",
          id: 2,
          reactionSummaries: [
            { count: 1, emoji: "✅", reactedByViewer: false },
          ],
          status: "closed",
        },
      ],
      id: 1,
      name: "サンプルプロダクト",
    },
  },
  component: Product,
  title: "Feature/User/Product",
} satisfies Meta<typeof Product>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
