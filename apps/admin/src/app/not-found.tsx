import { Empty, EmptyDescription, EmptyTitle } from "@repo/ui/components";

export default function NotFound() {
  return (
    <Empty>
      <EmptyTitle>404 - Not Found</EmptyTitle>
      <EmptyDescription>
        お探しのページは見つかりませんでした。
      </EmptyDescription>
    </Empty>
  );
}
