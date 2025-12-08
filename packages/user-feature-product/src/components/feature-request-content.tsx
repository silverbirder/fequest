import { Box, Textarea } from "@repo/ui/components";

type Props = {
  content: string;
};

export const FeatureRequestContent = (props: Props) => {
  return (
    <Box bg="muted" p="xs" radius="sm" w="full">
      <Textarea
        aria-label="機能リクエストの内容"
        readOnly
        value={props.content}
        variant="display"
      />
    </Box>
  );
};
