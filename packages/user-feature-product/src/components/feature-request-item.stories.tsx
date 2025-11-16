import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { FeatureRequestItem } from "./feature-request-item";

const meta = {
  args: {
    avatarFallbackText: "FR",
    featureId: 1,
    onReactToFeature: async () => {},
    reactions: [
      { count: 5, emoji: "👍", reactedByViewer: true },
      { count: 2, emoji: "🎉", reactedByViewer: false },
      { count: 0, emoji: "❤️", reactedByViewer: false },
      { count: 0, emoji: "🔥", reactedByViewer: false },
      { count: 1, emoji: "💡", reactedByViewer: false },
    ],
    text: "タグ付けができるようにしてほしい",
  },
  component: FeatureRequestItem,
  title: "Feature/User/FeatureRequestItem",
} satisfies Meta<typeof FeatureRequestItem>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
