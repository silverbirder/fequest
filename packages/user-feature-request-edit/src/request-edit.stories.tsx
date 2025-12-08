import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { RequestEdit } from "./request-edit";

const meta = {
  args: {
    backHref: { pathname: "/1" },
    defaultValues: {
      content:
        "細かな改善案をここに書きます。\nスクリーンショットも共有予定です。",
      title: "通知設定の改善",
    },
    featureId: 1,
    onDelete: async () => {},
    onSubmit: async () => {},
    productName: "Fequest",
    requestTitle: "通知設定の改善",
  },
  component: RequestEdit,
  title: "Feature/User/RequestEdit",
} satisfies Meta<typeof RequestEdit>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
