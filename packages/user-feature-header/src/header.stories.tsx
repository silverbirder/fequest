import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { Header } from "./header";

const meta = {
  component: Header,
  title: "Feature/User/Header",
} satisfies Meta<typeof Header>;

export default meta;
type Story = StoryObj<typeof meta>;

export const LoggedOut: Story = {
  args: {
    loginAction: async () => {},
    logoutAction: async () => {},
    user: null,
  },
};

export const LoggedIn: Story = {
  args: {
    loginAction: async () => {},
    logoutAction: async () => {},
    user: {
      image: "https://github.com/shadcn.png",
      name: "田中 花子",
    },
  },
};
