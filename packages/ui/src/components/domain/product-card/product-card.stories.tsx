import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { ProductCard } from "./product-card";

const meta = {
  args: {
    children: "ProductCard",
  },
  component: ProductCard,
  title: "Domain/ProductCard",
} satisfies Meta<typeof ProductCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
