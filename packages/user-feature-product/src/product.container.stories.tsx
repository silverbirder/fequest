import type { Meta, StoryObj } from "@storybook/nextjs";

import { ProductContainer } from "./product.container";

const meta = {
  title: "Features/User/Product/Container",
  component: ProductContainer,
} satisfies Meta<typeof ProductContainer>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
