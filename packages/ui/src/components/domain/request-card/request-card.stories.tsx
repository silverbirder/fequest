import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { DialogTrigger } from "../../common/shadcn";
import { RequestCard } from "./request-card";

const meta = {
  args: {
    avatar: {
      fallbackText: "NR",
    },
    detail: {
      content: (
        <div>
          <h2>コメント機能の追加</h2>
          <ul>
            <li>ユーザーが通知をまとめて確認できるようにして欲しいです。</li>
            <li>メールとアプリ内通知の両方があると助かります。</li>
          </ul>
        </div>
      ),
      createdAt: "2024-12-01T10:00:00.000Z",
      title: "コメント機能の追加",
      updatedAt: "2024-12-05T08:45:00.000Z",
    },
    enableEmojiPicker: true,
    reactions: [
      { count: 12, emoji: "👍", reactedByViewer: true },
      { count: 5, emoji: "❤️", reactedByViewer: false },
      { count: 3, emoji: "🎉", reactedByViewer: false },
    ],
    reactionsInteractive: true,
    text: "コメント機能の追加",
  },
  component: RequestCard,
  title: "Domain/RequestCard",
} satisfies Meta<typeof RequestCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Closed: Story = {
  args: {
    detail: {
      content: (
        <div>
          <h2>アップロード完了済み</h2>
          <p>このリクエストはリリース済みです。</p>
        </div>
      ),
      createdAt: "2024-10-01T10:00:00.000Z",
      title: "画像アップロード改善",
      updatedAt: "2024-11-01T10:00:00.000Z",
    },
    enableEmojiPicker: false,
    reactions: [],
    reactionsInteractive: false,
    status: "closed",
    text: "画像アップロードの改善",
  },
};

export const ReadOnlyReactions: Story = {
  args: {
    enableEmojiPicker: false,
    reactions: [
      { count: 8, emoji: "👍", reactedByViewer: false },
      { count: 2, emoji: "🎉", reactedByViewer: false },
      { count: 1, emoji: "❤️", reactedByViewer: true },
    ],
    reactionsInteractive: false,
  },
};

export const WithAdminCommentNotice: Story = {
  args: {
    adminCommentNoticeSlot: (
      <DialogTrigger asChild>
        <button data-slot="admin-comment-notice-trigger" type="button">
          管理者からコメントあり
        </button>
      </DialogTrigger>
    ),
  },
};
