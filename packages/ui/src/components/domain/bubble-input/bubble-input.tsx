import type { ComponentPropsWithoutRef } from "react";

import { cn } from "@repo/ui/lib/utils";

import { VStack } from "../../layout";
import { Input } from "../../shadcn";
import { Text } from "../../typography";

type BubbleInputProps = ComponentPropsWithoutRef<typeof Input> & {
  helperText?: string;
};

export const BubbleInput = ({
  className,
  helperText = "Enterで送信",
  placeholder = "新しいリクエストを入力...",
  type = "text",
  ...rest
}: BubbleInputProps) => {
  return (
    <VStack align="stretch" className="group" gap="xs">
      <Input
        className={cn(
          "border-none bg-none hover:bg-gray-100 shadow-none rounded-md p-3",
          className,
        )}
        placeholder={placeholder}
        type={type}
        {...rest}
      />
      <Text className="opacity-0 text-gray-500 text-sm transition-opacity duration-200 group-hover:opacity-100 group-focus-within:opacity-100">
        {helperText}
      </Text>
    </VStack>
  );
};
