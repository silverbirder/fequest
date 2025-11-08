import type { Meta, StoryObj } from "@storybook/nextjs";

import { Flex } from "./flex";

const meta = {
  title: "Layout/Flex",
  component: Flex,
  args: {
    children: [1, 2, 3].map((item) => (
      <div key={item} className="rounded-md bg-primary/10 px-4 py-2">
        Item {item}
      </div>
    )),
  },
} satisfies Meta<typeof Flex>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    gap: "md",
  },
};

export const Column: Story = {
  args: {
    direction: "column",
    gap: "lg",
    align: "start",
  },
};

export const Wrap: Story = {
  args: {
    wrap: "wrap",
    gap: "sm",
  },
  render: (args) => (
    <Flex {...args}>
      {[...Array(6)].map((_, index) => (
        <div
          key={index}
          className="min-w-[120px] rounded-md bg-primary/10 px-4 py-2"
        >
          Item {index + 1}
        </div>
      ))}
    </Flex>
  ),
};
