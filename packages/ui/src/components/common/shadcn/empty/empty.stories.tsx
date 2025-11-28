import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "./empty";

const meta = {
  args: {
    children: (
      <>
        <EmptyHeader>
          <EmptyMedia />
          <EmptyTitle>タイトル</EmptyTitle>
          <EmptyDescription>説明テキスト</EmptyDescription>
        </EmptyHeader>
        <EmptyContent>追加コンテンツ</EmptyContent>
      </>
    ),
  },
  component: Empty,
  title: "Common/Shadcn/Empty",
} satisfies Meta<typeof Empty>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithIcon: Story = {
  args: {
    children: (
      <>
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <svg
              fill="none"
              height="24"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
              width="24"
            >
              <circle cx="12" cy="12" r="10" />
              <path d="M8 12h8" />
            </svg>
          </EmptyMedia>
          <EmptyTitle>アイコン付き</EmptyTitle>
          <EmptyDescription>アイコンを表示した例です。</EmptyDescription>
        </EmptyHeader>
        <EmptyContent>追加コンテンツ</EmptyContent>
      </>
    ),
  },
};
