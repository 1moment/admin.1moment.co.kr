import { useMutation, useSuspenseQuery } from "@tanstack/react-query";
import { apiClient } from "@/utils/api-client.ts";

export type PromotionSectionMutationData = Pick<
  Partial<PromotionSection>,
  "title" | "description" | "sequence" | "status"
>;

export function usePromotionSections(options: {
  currentPage?: number;
  limit?: number;
  status: "PUBLISHED" | "DRAFT";
}) {
  const { currentPage = 1, limit = 30, status } = options || {};

  return useSuspenseQuery<{ items: PromotionSection[] }>({
    queryKey: ["promotion-sections", { status, page: currentPage, limit }],
    async queryFn() {
      const params = new URLSearchParams();
      params.set("page", `${currentPage}`);
      params.set("limit", status === "PUBLISHED" ? "100" : `${limit}`);
      if (status) params.set("status", status);

      const response = await apiClient(
        `/admin/promotion-sections?${params.toString()}`,
      );
      const result = await response.json();
      return result;
    },
  });
}

export function usePromotionSection(promotionSectionId: number) {
  return useSuspenseQuery<PromotionSection>({
    queryKey: ["promotion-sections", promotionSectionId],
    async queryFn() {
      const response = await apiClient(
        `/admin/promotion-sections/${promotionSectionId}`,
      );
      const result = await response.json();
      return result;
    },
  });
}

export function usePromotionSectionCreateMutation() {
  return useMutation<PromotionSection, Error, PromotionSectionMutationData>({
    async mutationFn(data) {
      const response = await apiClient("/admin/promotion-sections", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      if (result.error) {
        throw new Error(result.message);
      }

      return result;
    },
  });
}

export function usePromotionSectionUpdateMutation(promotionSectionId: number) {
  return useMutation<PromotionSection, Error, PromotionSectionMutationData>({
    async mutationFn(data) {
      const response = await apiClient(
        `/admin/promotion-sections/${promotionSectionId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        },
      );

      const result = await response.json();
      if (result.error) {
        throw new Error(result.message);
      }

      return result;
    },
  });
}

export function usePromotionSectionAddProduct(promotionSectionId: number) {
  return useMutation<
    PromotionCategory,
    Error,
    { productId: number }
  >({
    async mutationFn(data) {
      const result = await apiClient(
        `/admin/promotion-sections/${promotionSectionId}/products/${data.productId}`,
        {
          method: "CREATE",
        },
      );

      return await result.json();
    },
  });
}
