import { vi } from "vitest";
vi.mock("next-mdx-remote-client/rsc", () => ({
  MDXRemote: ({ children }: { children?: React.ReactNode }) => (
    <div>{children ?? "MDXRemote mock"}</div>
  ),
}));
import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { MdxContent } from "./mdx-content";

const meta = {
  args: {
    source: `# サンプルMDX\n\n- 箇条書き1\n- 箇条書き2\n\n**太字** や *斜体* も使えます。`,
  },
  component: MdxContent,
  title: "Domain/MdxContent",
} satisfies Meta<typeof MdxContent>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
