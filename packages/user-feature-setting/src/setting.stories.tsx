import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { Setting } from "./setting";

const meta = {
  args: {
    onWithdraw: async () => {},
  },
  component: Setting,
  title: "Feature/User/Setting",
} satisfies Meta<typeof Setting>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
