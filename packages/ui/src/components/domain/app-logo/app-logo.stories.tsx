import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { Text } from "../../common";
import { AppLogo } from "./app-logo";

const meta = {
  component: AppLogo,
  title: "Domain/AppLogo",
} satisfies Meta<typeof AppLogo>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};

export const CustomEmoji: Story = {
  args: {
    emoji: "✨",
  },
};

export const Admin: Story = {
  args: {
    label: "Fequest Admin",
  },
};

export const AsChild: Story = {
  args: {
    asChild: true,
  },
  render: (args) => (
    <AppLogo {...args}>
      <Text size="2xl" weight="semibold">
        Fequest
      </Text>
    </AppLogo>
  ),
};

export const TightBadge: Story = {
  args: {
    badgeVariant: "spacious",
  },
};
