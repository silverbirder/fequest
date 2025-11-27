import { MdxContent, VStack } from "@repo/ui/components";

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
      <div className="w-full">
        {props.isOwner && props.onUpdateFeatureRequest ? (
          <div className="flex justify-end">
            <FeatureRequestContentEditor
              content={props.content}
              featureId={props.featureId}
              onUpdateFeatureRequest={props.onUpdateFeatureRequest}
            />
          </div>
        ) : null}
        <MdxContent source={props.content} />
      </div>
    </VStack>
  );
};
