"use client";

import {
  type FeatureRequestCore,
  type FeatureRequestStatus,
  type FeatureRequestUser,
} from "@repo/type";
import { type ReactionSummary } from "@repo/type";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
  Box,
  Button,
  Heading,
  HStack,
  Input,
  RequestCard,
  SubmitButton,
  Text,
  Textarea,
  VStack,
} from "@repo/ui/components";
import { wrapActionWithToast } from "@repo/ui/lib/wrap-action-with-toast";
import { buildUserProductUrl } from "@repo/util";
import { useTranslations } from "next-intl";

type FeatureRequestWithUser = FeatureRequestCore & {
  reactionSummaries?: null | ReactionSummary[];
  user?: FeatureRequestUser | null;
};

type ProductDetail = {
  description?: null | string;
  featureRequests?: FeatureRequestWithUser[];
  homePageUrl?: null | string;
  id: number;
  logoUrl?: null | string;
  name: string;
};

type Props = {
  onDelete: (formData: FormData) => Promise<void>;
  onDeleteFeatureRequest: (formData: FormData) => Promise<void>;
  onUpdateDetails: (formData: FormData) => Promise<void>;
  onUpdateFeatureStatus: (formData: FormData) => Promise<void>;
  onUpdateName: (formData: FormData) => Promise<void>;
  product: ProductDetail;
  userDomainUrl: string;
};

const toTimestamp = (value: FeatureRequestCore["createdAt"]) => {
  if (!value) {
    return Number.POSITIVE_INFINITY;
  }

  const date = value instanceof Date ? value : new Date(value);
  const time = date.getTime();
  return Number.isNaN(time) ? Number.POSITIVE_INFINITY : time;
};

const getReactionCount = (feature: FeatureRequestWithUser) =>
  (feature.reactionSummaries ?? []).reduce(
    (total, reaction) => total + reaction.count,
    0,
  );

const sortFeatureRequests = (features: FeatureRequestWithUser[]) =>
  [...features].sort((left, right) => {
    const leftReactions = getReactionCount(left);
    const rightReactions = getReactionCount(right);

    if (leftReactions !== rightReactions) {
      return rightReactions - leftReactions;
    }

    const leftCreatedAt = toTimestamp(left.createdAt);
    const rightCreatedAt = toTimestamp(right.createdAt);

    if (leftCreatedAt !== rightCreatedAt) {
      return leftCreatedAt - rightCreatedAt;
    }

    return left.id - right.id;
  });

const createStatusCopy = (
  t: ReturnType<typeof useTranslations>,
  status: FeatureRequestStatus,
) =>
  status === "open"
    ? {
        actionLabel: t("status.open.actionLabel"),
        nextStatus: "closed" as const,
        toast: {
          error: t("status.open.toast.error"),
          loading: t("status.open.toast.loading"),
          success: t("status.open.toast.success"),
        },
      }
    : {
        actionLabel: t("status.closed.actionLabel"),
        nextStatus: "open" as const,
        toast: {
          error: t("status.closed.toast.error"),
          loading: t("status.closed.toast.loading"),
          success: t("status.closed.toast.success"),
        },
      };

export const Product = ({
  onDelete,
  onDeleteFeatureRequest,
  onUpdateDetails,
  onUpdateFeatureStatus,
  onUpdateName,
  product,
  userDomainUrl,
}: Props) => {
  const t = useTranslations("AdminProduct");
  const updateNameAction = wrapActionWithToast(onUpdateName, {
    error: t("toast.updateName.error"),
    loading: t("toast.updateName.loading"),
    success: t("toast.updateName.success"),
  });
  const updateDetailsAction = wrapActionWithToast(onUpdateDetails, {
    error: t("toast.updateDetails.error"),
    loading: t("toast.updateDetails.loading"),
    success: t("toast.updateDetails.success"),
  });
  const deleteProductAction = wrapActionWithToast(onDelete, {
    error: t("toast.deleteProduct.error"),
    loading: t("toast.deleteProduct.loading"),
    success: t("toast.deleteProduct.success"),
  });
  const deleteFeatureRequestAction = wrapActionWithToast(
    onDeleteFeatureRequest,
    {
      error: t("toast.deleteRequest.error"),
      loading: t("toast.deleteRequest.loading"),
      success: t("toast.deleteRequest.success"),
    },
  );

  const featureRequests = sortFeatureRequests(product.featureRequests ?? []);
  const userProductUrl = buildUserProductUrl(userDomainUrl, product.id);

  const productNameInputId = `product-name-${product.id}`;
  const productLogoUrlInputId = `product-logo-url-${product.id}`;
  const productHomePageUrlInputId = `product-homepage-url-${product.id}`;
  const productDescriptionInputId = `product-description-${product.id}`;

  return (
    <VStack gap="xl" w="full">
      <VStack gap="xs" w="full">
        <HStack align="center" justify="between" w="full" wrap="wrap">
          <Heading size="lg">{t("header.title")}</Heading>
          <Button asChild size="sm" variant="outline">
            <a
              aria-label={t("header.userPageAriaLabel", {
                url: userProductUrl,
              })}
              href={userProductUrl}
              rel="noreferrer"
              target="_blank"
            >
              {t("header.userPageLabel")}
            </a>
          </Button>
        </HStack>
        <Text color="muted" size="sm">
          {t("header.description")}
        </Text>
      </VStack>

      <Box bg="white" p="lg" radius="lg" w="full">
        <VStack align="start" gap="sm" w="full">
          <Text asChild size="sm" weight="bold">
            <label htmlFor={productNameInputId}>{t("rename.label")}</label>
          </Text>
          <Box asChild w="full">
            <form action={updateNameAction} data-slot="rename-form">
              <input name="productId" type="hidden" value={product.id} />
              <VStack gap="sm" w="full">
                <Box grow="1" minW="0" w="full">
                  <Input
                    aria-label={t("rename.ariaLabel")}
                    defaultValue={product.name}
                    id={productNameInputId}
                    maxLength={256}
                    name="name"
                    required
                  />
                </Box>
                <HStack justify="end" w="full">
                  <SubmitButton
                    formAction={updateNameAction}
                    pendingLabel={t("toast.updateName.loading")}
                    size="sm"
                    variant="default"
                  >
                    {t("rename.save")}
                  </SubmitButton>
                </HStack>
              </VStack>
            </form>
          </Box>
        </VStack>
      </Box>

      <Box bg="white" p="lg" radius="lg" w="full">
        <VStack align="start" gap="md" w="full">
          <VStack align="start" gap="xs">
            <Text size="sm" weight="bold">
              {t("details.title")}
            </Text>
            <Text color="muted" size="sm">
              {t("details.description")}
            </Text>
          </VStack>
          <Box asChild w="full">
            <form action={updateDetailsAction} data-slot="details-form">
              <input name="productId" type="hidden" value={product.id} />
              <VStack align="start" gap="md" w="full">
                <VStack align="start" gap="xs" w="full">
                  <Text asChild size="sm" weight="bold">
                    <label htmlFor={productLogoUrlInputId}>
                      {t("details.logoLabel")}
                    </label>
                  </Text>
                  <Box w="full">
                    <Input
                      aria-label={t("details.logoAriaLabel")}
                      defaultValue={product.logoUrl ?? ""}
                      id={productLogoUrlInputId}
                      maxLength={2048}
                      name="logoUrl"
                      placeholder="https://example.com/logo.png"
                    />
                  </Box>
                  <Text color="muted" size="xs">
                    {t("details.logoHelper")}
                  </Text>
                </VStack>

                <VStack align="start" gap="xs" w="full">
                  <Text asChild size="sm" weight="bold">
                    <label htmlFor={productHomePageUrlInputId}>
                      {t("details.homePageLabel")}
                    </label>
                  </Text>
                  <Box w="full">
                    <Input
                      aria-label={t("details.homePageAriaLabel")}
                      defaultValue={product.homePageUrl ?? ""}
                      id={productHomePageUrlInputId}
                      maxLength={2048}
                      name="homePageUrl"
                      placeholder="https://example.com"
                    />
                  </Box>
                  <Text color="muted" size="xs">
                    {t("details.homePageHelper")}
                  </Text>
                </VStack>

                <VStack align="start" gap="xs" w="full">
                  <Text asChild size="sm" weight="bold">
                    <label htmlFor={productDescriptionInputId}>
                      {t("details.descriptionLabel")}
                    </label>
                  </Text>
                  <Box w="full">
                    <Textarea
                      aria-label={t("details.descriptionAriaLabel")}
                      defaultValue={product.description ?? ""}
                      id={productDescriptionInputId}
                      maxLength={5000}
                      name="description"
                      placeholder={t("details.descriptionPlaceholder")}
                      rows={4}
                    />
                  </Box>
                  <Text color="muted" size="xs">
                    {t("details.descriptionHelper")}
                  </Text>
                </VStack>
                <HStack justify="end" w="full">
                  <SubmitButton
                    formAction={updateDetailsAction}
                    pendingLabel={t("toast.updateDetails.loading")}
                    size="sm"
                    variant="default"
                  >
                    {t("details.save")}
                  </SubmitButton>
                </HStack>
              </VStack>
            </form>
          </Box>
        </VStack>
      </Box>

      <VStack borderTop="default" gap="md" pt="xl" w="full">
        <VStack gap="xs" w="full">
          <Heading size="lg">{t("requests.title")}</Heading>
          <Text color="muted" size="sm">
            {t("requests.description")}
          </Text>
        </VStack>

        {featureRequests.length === 0 ? (
          <Box bg="white" p="md" radius="md" w="full">
            <Text color="muted">{t("requests.empty")}</Text>
          </Box>
        ) : (
          <VStack gap="md" w="full">
            {featureRequests.map((feature) => {
              const copy = createStatusCopy(t, feature.status);
              const title =
                feature.title?.trim() || t("requests.fallbackTitle");
              const statusAction = wrapActionWithToast(onUpdateFeatureStatus, {
                error: copy.toast.error,
                loading: copy.toast.loading,
                success: copy.toast.success,
              });

              return (
                <Box bg="white" key={feature.id} p="md" radius="md" w="full">
                  <VStack gap="sm" w="full">
                    <RequestCard
                      avatar={feature.user ?? undefined}
                      detail={{
                        content: (
                          <Box bg="muted" p="md" radius="sm" w="full">
                            <Textarea
                              aria-label={t("requests.contentAriaLabel")}
                              readOnly
                              value={
                                feature.content || t("requests.contentFallback")
                              }
                              variant="display"
                            />
                          </Box>
                        ),
                        createdAt: feature.createdAt,
                        title,
                        updatedAt: feature.updatedAt,
                      }}
                      idBase={`admin-feature-${feature.id}`}
                      reactions={feature.reactionSummaries ?? []}
                      reactionsInteractive={false}
                      status={feature.status}
                      text={title}
                    />
                    <HStack
                      borderTop="default"
                      gap="md"
                      justify="between"
                      pt="sm"
                      w="full"
                    >
                      <form
                        action={statusAction}
                        data-feature-id={feature.id}
                        data-slot="feature-status-form"
                      >
                        <input
                          name="featureId"
                          type="hidden"
                          value={feature.id}
                        />
                        <input
                          name="status"
                          type="hidden"
                          value={copy.nextStatus}
                        />
                        <SubmitButton
                          formAction={statusAction}
                          pendingLabel={t("toast.updateStatus.loading")}
                          size="sm"
                          variant="outline"
                        >
                          {copy.actionLabel}
                        </SubmitButton>
                      </form>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button size="sm" type="button" variant="destructive">
                            {t("requests.deleteLabel")}
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>
                              {t("requests.deleteTitle")}
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              {t("requests.deleteDescription")}
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <form
                            action={deleteFeatureRequestAction}
                            data-feature-id={feature.id}
                            data-slot="feature-delete-form"
                          >
                            <input
                              name="productId"
                              type="hidden"
                              value={product.id}
                            />
                            <input
                              name="featureId"
                              type="hidden"
                              value={feature.id}
                            />
                            <AlertDialogFooter>
                              <AlertDialogCancel>
                                {t("requests.deleteCancel")}
                              </AlertDialogCancel>
                              <SubmitButton
                                formAction={deleteFeatureRequestAction}
                                pendingLabel={t("toast.deleteRequest.loading")}
                                size="sm"
                                variant="destructive"
                              >
                                {t("requests.deleteConfirm")}
                              </SubmitButton>
                            </AlertDialogFooter>
                          </form>
                        </AlertDialogContent>
                      </AlertDialog>
                    </HStack>
                  </VStack>
                </Box>
              );
            })}
          </VStack>
        )}
      </VStack>

      <Box bg="white" p="lg" radius="lg" w="full">
        <VStack align="start" gap="sm" w="full">
          <Text size="sm" weight="bold">
            {t("deleteProduct.title")}
          </Text>
          <AlertDialog>
            <VStack align="start" gap="sm" w="full">
              <Text color="muted" size="sm">
                {t("deleteProduct.description")}
              </Text>
              <HStack justify="end" w="full">
                <AlertDialogTrigger asChild>
                  <Button size="sm" type="button" variant="destructive">
                    {t("deleteProduct.title")}
                  </Button>
                </AlertDialogTrigger>
              </HStack>
            </VStack>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>{t("deleteProduct.title")}</AlertDialogTitle>
                <AlertDialogDescription>
                  {t("deleteProduct.description")}
                </AlertDialogDescription>
              </AlertDialogHeader>
              <form action={deleteProductAction} data-slot="delete-form">
                <input name="productId" type="hidden" value={product.id} />
                <AlertDialogFooter>
                  <AlertDialogCancel>
                    {t("deleteProduct.cancel")}
                  </AlertDialogCancel>
                  <SubmitButton
                    formAction={deleteProductAction}
                    pendingLabel={t("toast.deleteProduct.loading")}
                    size="sm"
                    variant="destructive"
                  >
                    {t("deleteProduct.confirm")}
                  </SubmitButton>
                </AlertDialogFooter>
              </form>
            </AlertDialogContent>
          </AlertDialog>
        </VStack>
      </Box>
    </VStack>
  );
};
