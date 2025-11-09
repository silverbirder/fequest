import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { Product } from "./product";

const meta = {
  args: {
    onLikeFeature: async (formData: FormData) => {
      console.log("Liked feature with ID:", formData.get("featureId"));
    },
    product: {
      featureRequests: [
        {
          content: "ユーザーがプロフィール画像をアップロードできるようにする",
          id: 1,
          likes: 5,
          status: "検討中",
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
