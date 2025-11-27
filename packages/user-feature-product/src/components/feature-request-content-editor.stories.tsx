import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { FeatureRequestContentEditor } from "./feature-request-content-editor";

const meta = {
  args: {
    content: "ここに初期のコンテンツが入ります。Markdown もサポートします。",
    featureId: 11,
    onUpdateFeatureRequest: async (formData: FormData) => {
      console.log("update", Object.fromEntries(formData.entries()));
    },
  },
  component: FeatureRequestContentEditor,
  title: "Feature/User/FeatureRequestContentEditor",
} satisfies Meta<typeof FeatureRequestContentEditor>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
