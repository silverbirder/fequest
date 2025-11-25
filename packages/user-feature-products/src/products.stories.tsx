import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { Products } from "./products";

const meta = {
  args: {
    children: "Products",
  },
  component: Products,
} satisfies Meta<typeof Products>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
