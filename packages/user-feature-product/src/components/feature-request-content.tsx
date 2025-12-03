"use client";

import { Box, Button, HStack, Text } from "@repo/ui/components";
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
          <Form action={onUpdateFeatureRequest!}>
            <input
              name="featureId"
              type="hidden"
              value={String(props.featureId)}
            />
            <textarea
              defaultValue={props.content}
              name="content"
              style={{
                width: "100%",
              }}
            />
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
