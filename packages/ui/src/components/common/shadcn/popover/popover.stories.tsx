import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { Button } from "../button";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";

const meta = {
  component: Popover,
  title: "Common/Shadcn/Popover",
} satisfies Meta<typeof Popover>;

export default meta;
type Story = StoryObj<typeof meta>;

const Shell = ({ children }: { children: React.ReactNode }) => (
  <Popover>
    <PopoverTrigger asChild>
      <Button variant="outline">Open Popover</Button>
    </PopoverTrigger>
    <PopoverContent sideOffset={8}>{children}</PopoverContent>
  </Popover>
);

export const Default: Story = {
  render: () => (
    <Shell>
      <div data-slot="popover-content" style={{ padding: 12 }}>
        Popover content goes here
      </div>
    </Shell>
  ),
};
