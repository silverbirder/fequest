import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { Avatar, AvatarFallback, AvatarImage } from "./avatar";

const meta = {
  component: Avatar,
  title: "Common/Shadcn/Avatar",
} satisfies Meta<typeof Avatar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <Avatar {...args}>
      <AvatarImage alt="shadcn" src="https://github.com/shadcn.png" />
      <AvatarFallback>SC</AvatarFallback>
    </Avatar>
  ),
};

export const WithFallback: Story = {
  render: (args) => (
    <Avatar {...args}>
      <AvatarImage alt="No avatar available" src="/invalid-path.jpg" />
      <AvatarFallback>NA</AvatarFallback>
    </Avatar>
  ),
};
