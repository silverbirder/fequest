import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { EmojiReaction } from "./emoji-reaction";

const meta = {
  args: {
    count: 5,
    emoji: "😀",
  },
  component: EmojiReaction,
  title: "Domain/EmojiReaction",
} satisfies Meta<typeof EmojiReaction>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
