import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { FeatureRequestContent } from "./feature-request-content";

const meta = {
  args: {
    content: "テキスト表示だけの例です。\n複数行もそのまま表示します。",
  },
  component: FeatureRequestContent,
  title: "Feature/User/FeatureRequestContent",
} satisfies Meta<typeof FeatureRequestContent>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Viewer: Story = {};
