import { Box, HStack, MdxContent, VStack } from "@repo/ui/components";

import { FeatureRequestContentEditor } from "./feature-request-content-editor";

type Props = {
  content: string;
  featureId: number;
  isOwner: boolean;
  onUpdateFeatureRequest?: (formData: FormData) => Promise<void>;
};

export const FeatureRequestContent = (props: Props) => {
  return (
    <VStack gap="sm">
      <Box w="full">
        {props.isOwner && props.onUpdateFeatureRequest ? (
          <HStack justify="end">
            <FeatureRequestContentEditor
              content={props.content}
              featureId={props.featureId}
              onUpdateFeatureRequest={props.onUpdateFeatureRequest}
            />
          </HStack>
        ) : null}
        <MdxContent source={props.content} />
      </Box>
    </VStack>
  );
};
