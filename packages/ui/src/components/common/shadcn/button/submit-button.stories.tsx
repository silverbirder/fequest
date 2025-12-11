import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { SubmitButton } from "./submit-button";

const meta = {
  args: { children: "送信する" },
  component: SubmitButton,
  title: "Common/Shadcn/SubmitButton",
} satisfies Meta<typeof SubmitButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const PendingByProps: Story = {
  args: {
    pending: true,
    pendingLabel: "送信中...",
  },
  render: (args) => (
    <form action={async () => {}}>
      <SubmitButton {...args} />
    </form>
  ),
};

export const PendingByFormStatus: Story = {
  render: () => (
    <form action={async () => {}}>
      <SubmitButton pendingLabel="送信中...">送信する</SubmitButton>
    </form>
  ),
};
