import type { ComponentPropsWithoutRef } from "react";

import { VStack } from "../../layout";
import { Input } from "../../shadcn";
import { Text } from "../../typography";

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
