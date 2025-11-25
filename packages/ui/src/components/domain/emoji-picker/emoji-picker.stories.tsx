import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { EmojiPicker } from "./emoji-picker";

const meta = {
  args: {
    label: "リアクションを追加",
  },
  component: EmojiPicker,
  title: "Domain/EmojiPicker",
} satisfies Meta<typeof EmojiPicker>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    onSelect: () => {},
  },
};
