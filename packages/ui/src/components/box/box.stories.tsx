import type { Meta, StoryObj } from "@storybook/nextjs";

import { Box } from "./box";

const meta = {
  title: "Layout/Box",
  component: Box,
  args: {
    className: "rounded-md border border-border bg-background p-4 shadow-sm",
    children: "This content is inside the box",
  },
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
