import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { HStack, VStack } from "./stack";

const meta = {
  args: {
    gap: "md",
    justify: "start",
  },
  component: HStack,
  render: (args) => (
    <HStack {...args}>
      <div className="rounded-md bg-primary/10 px-4 py-2">Item 1</div>
      <div className="rounded-md bg-primary/10 px-4 py-2">Item 2</div>
      <div className="rounded-md bg-primary/10 px-4 py-2">Item 3</div>
    </HStack>
  ),
  title: "Common/Layout/Stack",
} satisfies Meta<typeof HStack>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Horizontal: Story = {};

export const Vertical: Story = {
  render: (args) => (
    <VStack {...args}>
      <div className="rounded-md bg-primary/10 px-4 py-2">Item 1</div>
      <div className="rounded-md bg-primary/10 px-4 py-2">Item 2</div>
      <div className="rounded-md bg-primary/10 px-4 py-2">Item 3</div>
    </VStack>
  ),
};

export const Inline: Story = {
  args: {
    inline: true,
  },
};
