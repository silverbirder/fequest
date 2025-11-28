import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { Flex } from "./flex";

const meta = {
  args: {
    children: [1, 2, 3].map((item) => (
      <div className="rounded-md bg-primary/10 px-4 py-2" key={item}>
        Item {item}
      </div>
    )),
  },
  component: Flex,
  title: "Common/Layout/Flex",
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
    align: "start",
    direction: "column",
    gap: "lg",
  },
};

export const Wrap: Story = {
  args: {
    gap: "sm",
    wrap: "wrap",
  },
  render: (args) => (
    <Flex {...args}>
      {[...Array(6)].map((_, index) => (
        <div
          className="min-w-[120px] rounded-md bg-primary/10 px-4 py-2"
          key={index}
        >
          Item {index + 1}
        </div>
      ))}
    </Flex>
  ),
};
