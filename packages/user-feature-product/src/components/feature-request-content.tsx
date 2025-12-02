import { Box, MdxContent } from "@repo/ui/components";

import { FeatureRequestContentEditor } from "./feature-request-content-editor";

type Props = {
  content: string;
  featureId: number;
  isOwner: boolean;
  onUpdateFeatureRequest?: (formData: FormData) => Promise<void>;
};

export const FeatureRequestContent = (props: Props) => {
  return (
    <Box minH="30" position="relative" w="full">
      {props.isOwner && props.onUpdateFeatureRequest ? (
        <Box bottom="0" position="absolute" right="0">
          <FeatureRequestContentEditor
            content={props.content}
            featureId={props.featureId}
            onUpdateFeatureRequest={props.onUpdateFeatureRequest}
          />
        </Box>
      ) : null}
      <MdxContent source={props.content} />
    </Box>
  );
};
