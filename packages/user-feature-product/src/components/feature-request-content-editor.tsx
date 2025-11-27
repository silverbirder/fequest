"use client";

import { Box, Button, HStack } from "@repo/ui/components";
import Form from "next/form";
import { useState } from "react";

type Props = {
  content: string;
  featureId: number;
  onUpdateFeatureRequest?: (formData: FormData) => Promise<void>;
};

export const FeatureRequestContentEditor = (props: Props) => {
  const [editing, setEditing] = useState(false);

  if (!props.onUpdateFeatureRequest) return null;

  return !editing ? (
    <Button onClick={() => setEditing(true)} size="sm">
      編集
    </Button>
  ) : (
    <Box asChild w="full">
      <Form action={props.onUpdateFeatureRequest}>
        <input name="featureId" type="hidden" value={String(props.featureId)} />
        <textarea defaultValue={props.content} name="content" />
        <HStack gap="sm">
          <Button type="submit">保存</Button>
          <Button
            onClick={() => setEditing(false)}
            type="button"
            variant="ghost"
          >
            取消
          </Button>
        </HStack>
      </Form>
    </Box>
  );
};
