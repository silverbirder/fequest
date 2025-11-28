import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { Box } from "./box";

const meta = {
  args: {
    children: "This content is inside the box",
    className: "rounded-md border border-border bg-background p-4 shadow-sm",
  },
  component: Box,
  title: "Common/Layout/Box",
} satisfies Meta<typeof Box>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const AsChild: Story = {
  render: (args) => (
    <Box asChild {...args}>
      <article className="rounded-md border border-dashed p-4">
        Article wrapper via Slot
      </article>
    </Box>
  ),
};
