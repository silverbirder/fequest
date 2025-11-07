import type { Meta, StoryObj } from "@storybook/nextjs";

import { ProductComponent } from "./product.component";

const meta = {
  title: "Features/User/Product/Component",
  component: ProductComponent,
  args: {
    title: "Product",
    description: "Product feature placeholder",
  },
} satisfies Meta<typeof ProductComponent>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
