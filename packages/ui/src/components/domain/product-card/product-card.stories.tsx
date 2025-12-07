import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { ProductCard } from "./product-card";

const meta = {
  args: {
    href: { pathname: "/products/1" },
    name: "Fequest Product",
    requestCount: 1280,
  },
  component: ProductCard,
  title: "Domain/ProductCard",
} satisfies Meta<typeof ProductCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithLogo: Story = {
  args: {
    href: { pathname: "/products/2" },
    name: "Fequest Portal",
    requestCount: 6400,
  },
};
