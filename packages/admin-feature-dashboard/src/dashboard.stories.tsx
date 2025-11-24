import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { Dashboard } from "./dashboard";

const meta = {
  args: {
    children: "Dashboard",
  },
  component: Dashboard,
  title: "Feature/Admin/Dashboard",
} satisfies Meta<typeof Dashboard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
