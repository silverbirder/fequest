import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { Textarea } from "./textarea";

const meta = {
  args: {
    placeholder: "Share your feedback...",
    rows: 4,
  },
  component: Textarea,
  title: "Common/Shadcn/Textarea",
} satisfies Meta<typeof Textarea>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Disabled: Story = {
  args: {
    disabled: true,
    placeholder: "Textarea is disabled",
  },
};

export const WithValue: Story = {
  args: {
    defaultValue: "Pre-filled content\nYou can keep writing...",
    rows: 6,
  },
};

export const Invalid: Story = {
  args: {
    "aria-invalid": true,
    placeholder: "Required field",
  },
};
