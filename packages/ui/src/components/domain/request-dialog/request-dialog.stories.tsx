import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { RequestDialog } from "./request-dialog";

const meta = {
  args: {
    avatar: {
      fallbackText: "NR",
    },
    detail: {
      content: (
        <div className="prose prose-slate prose-sm dark:prose-invert">
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
    dialogTitle: "コメント機能の追加",
    dialogTriggerLabel: "コメント機能の追加の詳細を表示",
  },
  component: RequestDialog,
  title: "Domain/RequestDialog",
} satisfies Meta<typeof RequestDialog>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const label = meta.args?.dialogTriggerLabel ?? "詳細を表示";
    const trigger = canvasElement.querySelector<HTMLButtonElement>(
      `button[aria-label='${label}']`,
    );
    trigger?.click();
  },
};
