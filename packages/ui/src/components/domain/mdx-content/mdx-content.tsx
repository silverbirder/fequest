import type { MDXComponents } from "mdx/types";

import { MDXRemote } from "next-mdx-remote-client/rsc";

import { Box } from "../../layout";

type Props = {
  components?: MDXComponents;
  source: string;
};

export const MdxContent = ({ components, source }: Props) => (
  <Box prose="sm">
    <MDXRemote components={components} source={source} />
  </Box>
);
