import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { Container } from "./container";

const meta = {
  args: {
    children: (
      <div className="rounded-md border border-dashed border-primary/30 bg-primary/5 p-6">
        Responsive container content
      </div>
    ),
  },
  component: Container,
  title: "Common/Layout/Container",
} satisfies Meta<typeof Container>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const CenterContent: Story = {
  args: {
    centerContent: true,
    children: (
      <div className="max-w-md space-y-2">
        <h3 className="text-xl font-bold">Centered layout</h3>
        <p className="text-muted-foreground">
          Center your content both horizontally and vertically within the
          container.
        </p>
      </div>
    ),
  },
};

export const Fluid: Story = {
  args: {
    padding: "lg",
    size: "full",
  },
};
