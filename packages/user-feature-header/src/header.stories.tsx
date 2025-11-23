import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { Header } from "./header";

const meta = {
  args: {
    children: "Header",
  },
  component: Header,
  title: "Feature/User/Header",
} satisfies Meta<typeof Header>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
