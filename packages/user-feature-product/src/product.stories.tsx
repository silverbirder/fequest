import type { Meta, StoryObj } from "@storybook/nextjs";

import { Product } from "./product";

const meta = {
  title: "Feature/User/Product",
  component: Product,
  args: {
    product: {
      id: 1,
      name: "サンプルプロダクト",
      featureRequests: [
        {
          id: 1,
          content: "ユーザーがプロフィール画像をアップロードできるようにする",
          likes: 5,
          status: "検討中",
        },
      ],
    },
    onLikeFeature: async (formData: FormData) => {
      console.log("Liked feature with ID:", formData.get("featureId"));
    },
  },
} satisfies Meta<typeof Product>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
