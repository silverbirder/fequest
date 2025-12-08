import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { RequestEdit } from "./request-edit";

const meta = {
  args: {
    children: "RequestEdit",
  },
  component: RequestEdit,
  title: "Feature/User/RequestEdit",
} satisfies Meta<typeof RequestEdit>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
