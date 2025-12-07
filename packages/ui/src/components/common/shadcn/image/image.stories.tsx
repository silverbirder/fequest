import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { Image } from "./image";

const meta = {
  args: {
    alt: "Sample logo",
    height: 120,
    src: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Crect width='120' height='120' rx='12' fill='%23f1f5f9'/%3E%3Ctext x='50%25' y='55%25' text-anchor='middle' font-family='sans-serif' font-size='28' fill='%23334155'%3ELOGO%3C/text%3E%3C/svg%3E",
    width: 120,
  },
  component: Image,
  title: "Shadcn/Image",
} satisfies Meta<typeof Image>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
