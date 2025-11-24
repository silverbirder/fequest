import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { Dashboard } from "./dashboard";

const meta = {
  args: {
    products: [
      { featureCount: 3, id: 1, name: "Alpha", reactionCount: 5 },
      { featureCount: 0, id: 2, name: "Beta", reactionCount: 1 },
    ],
  },
  component: Dashboard,
  title: "Feature/Admin/Dashboard",
} satisfies Meta<typeof Dashboard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Empty: Story = {
  args: {
    products: [],
  },
};
