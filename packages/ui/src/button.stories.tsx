import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Button } from "./button";

const meta = {
  title: "Example/Button",
  component: Button,
  args: { appName: "TestApp", children: "Click Me" },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    appName: "TestApp",
  },
};
