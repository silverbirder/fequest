import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { Product } from "./product";

const meta = {
  args: {
    onUpdateFeatureStatus: async () => {},
    onUpdateName: async () => {},
    product: {
      featureRequests: [
        {
          content: "ユーザーから寄せられた最初の質問です。",
          createdAt: "2024-01-01T00:00:00.000Z",
          id: 1,
          status: "open",
          title: "アルファ版での改善点",
          updatedAt: "2024-01-10T12:30:00.000Z",
        },
        {
          content: "完了済みの質問。クローズ扱いです。",
          createdAt: "2024-02-05T09:00:00.000Z",
          id: 2,
          status: "closed",
          title: "通知機能はありますか？",
          updatedAt: "2024-02-08T15:45:00.000Z",
        },
      ],
      id: 99,
      name: "Fequest Admin",
    },
  },
  component: Product,
  title: "Features/Admin/Product",
} satisfies Meta<typeof Product>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const EmptyFeatures: Story = {
  args: {
    product: { featureRequests: [], id: 1, name: "Empty Product" },
  },
};
