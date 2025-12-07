import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { Top } from "./top";

const meta = {
  component: Top,
  title: "Feature/User/Top",
} satisfies Meta<typeof Top>;

export default meta;
type Story = StoryObj<typeof meta>;

export const WithProducts: Story = {
  args: {
    adminDomain: "https://admin.fequest.test",
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
