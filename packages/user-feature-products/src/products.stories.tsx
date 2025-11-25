import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { Products } from "./products";

const meta = {
  component: Products,
} satisfies Meta<typeof Products>;

export default meta;
type Story = StoryObj<typeof meta>;

export const WithProducts: Story = {
  args: {
    products: [
      {
        featureCount: 3,
        id: 1,
        name: "プロダクトA",
        reactionCount: 5,
      },
      {
        featureCount: 0,
        id: 2,
        name: "プロダクトB",
        reactionCount: 0,
      },
    ],
  },
};

export const Empty: Story = {
  args: {
    products: [],
  },
};
