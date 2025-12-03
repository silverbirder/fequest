"use client";

import { Box, Button, HStack, Text, Textarea } from "@repo/ui/components";
import { Pencil } from "lucide-react";
import Form from "next/form";
import { useState } from "react";

type Props = {
  content: string;
  featureId: number;
  isOwner: boolean;
  onUpdateFeatureRequest?: (formData: FormData) => Promise<void>;
};

export const FeatureRequestContent = (props: Props) => {
  const [editing, setEditing] = useState(false);
  const onUpdateFeatureRequest = props.onUpdateFeatureRequest;
  const showEditor = props.isOwner && Boolean(onUpdateFeatureRequest);

  const handleUpdateFeatureRequest = async (formData: FormData) => {
    if (!onUpdateFeatureRequest) {
      return;
    }

    try {
      await onUpdateFeatureRequest(formData);
      setEditing(false);
    } catch (error) {
      console.error("Failed to update feature request", error);
    }
  };

  return (
    <Box minH="30" position="relative" w="full">
      {showEditor ? (
        <Box position="absolute" right="0" top="0">
          {!editing ? (
            <Button
              aria-label="編集する"
              onClick={() => setEditing(true)}
              size="icon"
              variant="ghost"
            >
              <Pencil />
            </Button>
          ) : null}
        </Box>
      ) : null}
      {editing && showEditor ? (
        <Box asChild w="full">
          <Form action={handleUpdateFeatureRequest}>
            <input
              name="featureId"
              type="hidden"
              value={String(props.featureId)}
            />
            <Textarea defaultValue={props.content} name="content" />
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
      ) : (
        <Text>{props.content}</Text>
      )}
    </Box>
  );
};
