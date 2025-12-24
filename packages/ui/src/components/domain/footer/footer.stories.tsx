import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { Footer } from "./footer";

const meta = {
  component: Footer,
  title: "Domain/Footer",
} satisfies Meta<typeof Footer>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};

export const CustomCredit: Story = {
  args: {
    creditText: "© 2025 silverbirder. All rights reserved.",
  },
};
