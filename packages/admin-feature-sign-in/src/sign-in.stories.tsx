import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { SignIn } from "./sign-in";

const meta = {
  args: {
    children: "SignIn",
  },
  component: SignIn,
} satisfies Meta<typeof SignIn>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
