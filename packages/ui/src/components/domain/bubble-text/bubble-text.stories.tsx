import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { BubbleText } from "./bubble-text";

const meta = {
  args: {
    text: "コメント機能の追加",
  },
  component: BubbleText,
  title: "Domain/BubbleText",
} satisfies Meta<typeof BubbleText>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithAdminCommentNotice: Story = {
  args: {
    adminCommentNoticeSlot: (
      <button data-slot="admin-comment-notice-trigger" type="button">
        管理者からコメントあり
      </button>
    ),
  },
};
