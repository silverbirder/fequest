import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { Product } from "./product";

const meta = {
  args: {
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
          reactions: [{ emoji: "👍" }, { emoji: "👍" }, { emoji: "🎉" }],
          status: "open",
        },
        {
          content: "管理者向けダッシュボードにフィルタリング機能を追加",
          id: 2,
          reactions: [{ emoji: "✅" }],
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
