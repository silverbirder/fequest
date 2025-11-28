import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { Grid } from "./grid";

const meta = {
  args: {
    children: [...Array(6)].map((_, index) => (
      <div
        className="rounded-md bg-primary/10 px-4 py-8 text-center"
        key={index}
      >
        Item {index + 1}
      </div>
    )),
    columns: "3",
    gap: "md",
  },
  component: Grid,
  title: "Common/Layout/Grid",
} satisfies Meta<typeof Grid>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Dense: Story = {
  args: {
    columns: "4",
    flow: "row-dense",
    gap: "sm",
  },
  render: (args) => (
    <Grid {...args}>
      {[160, 120, 200, 140, 100, 180].map((height, index) => (
        <div
          className="rounded-md bg-primary/10 px-4"
          key={index}
          style={{ minHeight: height }}
        >
          Box {index + 1}
        </div>
      ))}
    </Grid>
  ),
};

export const Inline: Story = {
  args: {
    align: "center",
    columns: "2",
    gap: "lg",
    inline: true,
  },
};
