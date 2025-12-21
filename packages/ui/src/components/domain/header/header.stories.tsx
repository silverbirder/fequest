import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { Header } from "./header";

const meta = {
  component: Header,
  title: "Domain/Header",
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
    links: [
      {
        external: true,
        href: { href: "https://admin.fequest.local" },
        label: "管理ページ",
      },
      {
        href: "/setting",
        label: "設定",
      },
    ],
    loginAction: async () => {},
    logoutAction: async () => {},
    user: {
      image: "https://github.com/shadcn.png",
      name: "田中 花子",
    },
  },
};
