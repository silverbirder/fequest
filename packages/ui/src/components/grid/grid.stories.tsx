import type { Meta, StoryObj } from "@storybook/nextjs";

import { Grid } from "./grid";

const meta = {
  title: "Layout/Grid",
  component: Grid,
  args: {
    columns: "3",
    gap: "md",
    children: [...Array(6)].map((_, index) => (
      <div
        key={index}
        className="rounded-md bg-primary/10 px-4 py-8 text-center"
      >
        Item {index + 1}
      </div>
    )),
  },
} satisfies Meta<typeof Grid>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Dense: Story = {
  args: {
    flow: "row-dense",
    gap: "sm",
    columns: "4",
  },
  render: (args) => (
    <Grid {...args}>
      {[160, 120, 200, 140, 100, 180].map((height, index) => (
        <div
          key={index}
          className="rounded-md bg-primary/10 px-4"
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
    inline: true,
    columns: "2",
    gap: "lg",
    align: "center",
  },
};
