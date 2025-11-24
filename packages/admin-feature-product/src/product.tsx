import type { PropsWithChildren } from "react";

type Props = PropsWithChildren;

export const Product = ({ children }: Props) => {
  return <div>{children}</div>;
};
