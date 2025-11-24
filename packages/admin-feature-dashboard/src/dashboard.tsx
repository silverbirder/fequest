import type { PropsWithChildren } from "react";

type Props = PropsWithChildren;

export const Dashboard = ({ children }: Props) => {
  return <div>{children}</div>;
};
