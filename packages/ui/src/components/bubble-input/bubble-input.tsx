import { VStack } from "../layout";
import { Input } from "../shadcn";
import { Text } from "../typography";

export const BubbleInput = () => {
  return (
    <VStack align="stretch" className="group" gap="xs">
      <Input
        className="border-none bg-none hover:bg-gray-100 shadow-none rounded-md p-3"
        placeholder="新しいリクエストを入力..."
      />
      <Text className="opacity-0 text-gray-500 text-sm transition-opacity duration-200 group-hover:opacity-100 group-focus-within:opacity-100">
        Enterで送信
      </Text>
    </VStack>
  );
};
