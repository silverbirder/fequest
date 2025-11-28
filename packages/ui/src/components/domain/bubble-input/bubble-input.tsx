import type { ComponentPropsWithoutRef } from "react";

import { VStack } from "../../common/layout";
import { Input } from "../../common/shadcn";
import { Text } from "../../common/typography";

type BubbleInputProps = ComponentPropsWithoutRef<typeof Input> & {
  helperText?: string;
};

export const BubbleInput = ({
  helperText = "Enterで送信",
  placeholder = "新しいリクエストを入力...",
  type = "text",
  ...rest
}: BubbleInputProps) => {
  return (
    <VStack align="stretch" gap="xs">
      <Input placeholder={placeholder} type={type} {...rest} />
      <Text color="muted" size="sm">
        {helperText}
      </Text>
    </VStack>
  );
};
