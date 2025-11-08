import type { Meta, StoryObj } from "@storybook/nextjs";

import { ProductComponent } from "./product.component";

const meta = {
  component: ProductComponent,
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
  },
} satisfies Meta<typeof ProductComponent>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
