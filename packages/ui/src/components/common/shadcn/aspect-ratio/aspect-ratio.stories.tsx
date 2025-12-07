import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { AspectRatio } from "./aspect-ratio";

const meta = {
  args: {
    ratio: 16 / 9,
  },
  component: AspectRatio,
  title: "Shadcn/AspectRatio",
} satisfies Meta<typeof AspectRatio>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <AspectRatio {...args}>
      <div className="bg-muted flex h-full w-full items-center justify-center rounded-md">
        16:9
      </div>
    </AspectRatio>
  ),
};

export const Square: Story = {
  args: { ratio: 1 },
  render: (args) => (
    <AspectRatio {...args}>
      <div className="bg-muted flex h-full w-full items-center justify-center rounded-md">
        1:1
      </div>
    </AspectRatio>
  ),
};
