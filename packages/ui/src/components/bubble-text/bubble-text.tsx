import type { PropsWithChildren } from "react";

type Props = PropsWithChildren<{
  className?: string;
}>;

export const BubbleText = ({ children, className }: Props) => {
  return <div className={className}>{children}</div>;
};
