import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { Product } from "./product";

const meta = {
  args: {
    children: "Product",
  },
  component: Product,
  title: "Features/Admin/Product",
} satisfies Meta<typeof Product>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
