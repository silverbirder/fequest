"use client";

import type { ComponentProps } from "react";

import * as AvatarPrimitive from "@radix-ui/react-avatar";
import { cn } from "@repo/ui/lib/utils";

type AvatarFallbackProps = ComponentProps<typeof AvatarPrimitive.Fallback>;
type AvatarImageProps = ComponentProps<typeof AvatarPrimitive.Image>;
type AvatarRootProps = ComponentProps<typeof AvatarPrimitive.Root>;

const getInitials = (name?: null | string) => {
  const trimmed = name?.trim();
  if (!trimmed) return undefined;

  const parts = trimmed.split(/\s+/).filter(Boolean);
  if (parts.length === 0) return undefined;
  if (parts.length === 1) {
    const first = parts[0];
    return first ? first.slice(0, 2).toUpperCase() : undefined;
  }

  const first = parts.at(0)?.[0];
  const last = parts.at(-1)?.[0];
  return `${first ?? ""}${last ?? ""}`.toUpperCase();
};

export const AvatarRoot = ({ className, ...props }: AvatarRootProps) => (
  <AvatarPrimitive.Root
    className={cn(
      "relative flex size-8 shrink-0 overflow-hidden rounded-full",
      className,
    )}
    data-slot="avatar"
    {...props}
  />
);

export const AvatarFallback = ({
  className,
  ...props
}: AvatarFallbackProps) => (
  <AvatarPrimitive.Fallback
    className={cn(
      "bg-muted text-muted-foreground flex size-full items-center justify-center rounded-full text-xs font-bold uppercase",
      className,
    )}
    data-slot="avatar-fallback"
    {...props}
  />
);

export const AvatarImage = ({ className, ...props }: AvatarImageProps) => (
  <AvatarPrimitive.Image
    className={cn("aspect-square size-full", className)}
    data-slot="avatar-image"
    {...props}
  />
);

type Props = Omit<AvatarRootProps, "children"> & {
  alt?: AvatarImageProps["alt"] | null;
  className?: AvatarRootProps["className"] | null;
  fallbackText?: null | string;
  imageClassName?: AvatarImageProps["className"] | null;
  imageProps?: null | Omit<AvatarImageProps, "alt" | "className" | "src">;
  name?: null | string;
  src?: AvatarImageProps["src"] | null;
};

export const Avatar = ({
  alt,
  className,
  fallbackText,
  imageClassName,
  imageProps,
  name,
  src,
  ...avatarProps
}: Props) => {
  const initials = getInitials(name ?? undefined);
  const fallbackLabel = fallbackText?.trim() || initials || "??";
  const altText =
    alt?.trim() || (name?.trim() ? `${name.trim()} avatar` : "User avatar");
  const safeImageProps = imageProps ?? {};

  return (
    <AvatarRoot className={className ?? undefined} {...avatarProps}>
      <AvatarImage
        alt={altText}
        className={imageClassName ?? undefined}
        src={src ?? undefined}
        {...safeImageProps}
      />
      <AvatarFallback>{fallbackLabel}</AvatarFallback>
    </AvatarRoot>
  );
};
