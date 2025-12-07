import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { ProductLogo } from "./product-logo";

const meta = {
  args: {
    logoUrl: "https://placehold.co/120x120",
    name: "Fequest",
  },
  component: ProductLogo,
  title: "Domain/ProductLogo",
} satisfies Meta<typeof ProductLogo>;

export default meta;
type Story = StoryObj<typeof meta>;

export const WithLogo: Story = {};

export const WithoutLogo: Story = {
  args: {
    logoUrl: null,
  },
};
