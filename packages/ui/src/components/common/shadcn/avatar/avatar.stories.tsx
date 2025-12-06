import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { Avatar } from "./avatar";

const meta = {
  args: {
    name: "shadcn",
    src: "https://github.com/shadcn.png",
  },
  component: Avatar,
  title: "Common/Shadcn/Avatar",
} satisfies Meta<typeof Avatar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithFallback: Story = {
  args: {
    fallbackText: "SC",
    src: undefined,
  },
};
