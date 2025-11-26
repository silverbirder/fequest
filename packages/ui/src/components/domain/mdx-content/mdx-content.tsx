import type { MDXComponents } from "mdx/types";

import { MDXRemote } from "next-mdx-remote-client/rsc";

import { Box } from "../../layout";

type Props = {
  components?: MDXComponents;
  source: string;
};

export const MdxContent = ({ components, source }: Props) => (
  <Box className="prose prose-slate prose-sm dark:prose-invert">
    <MDXRemote components={components} source={source} />
  </Box>
);
