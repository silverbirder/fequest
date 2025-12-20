import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { Setting } from "./setting";

const meta = {
  args: {
    children: "Setting",
  },
  component: Setting,
  title: "Feature/Admin/Setting",
} satisfies Meta<typeof Setting>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
