import { useMutation, useSuspenseQuery } from "@tanstack/react-query";
import { apiClient } from "@/utils/api-client.ts";

export type PromotionPageMutationData = Pick<
  PromotionPage,
  "title" | "status" | "html" | "slug" | "description"
>;

export function usePromotionPages(options) {
  const { currentPage = 1, status = "PUBLISHED" } = options || {};

  return useSuspenseQuery<{ items: PromotionPage[]; meta: PaginationMeta }>({
    queryKey: ["promotion-pages", { page: currentPage, status }],
    async queryFn() {
      const params = new URLSearchParams();
      params.set("page", `${currentPage}`);
      params.set("limit", "20");
      if (status) params.set("status", status);
      const response = await apiClient(
        `/admin/promotion-pages?${params.toString()}`,
      );
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.message || "Failed to fetch promotion pages");
      }
      return result;
    },
  });
}

export function usePromotionPage(promotionPageId: number) {
  return useSuspenseQuery<PromotionPage>({
    queryKey: ["promotion-pages", promotionPageId],
    async queryFn() {
      const response = await apiClient(
        `/admin/promotion-pages/${promotionPageId}`,
      );
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.message || "Failed to fetch promotion pages");
      }
      return result;
    },
  });
}

export function usePromotionPageCreateMutation() {
  return useMutation<PromotionPage, Error, PromotionPageMutationData>({
    async mutationFn(data) {
      const response = await apiClient("/admin/promotion-pages", {
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

export function usePromotionPageUpdateMutation(promotionSectionId: number) {
  return useMutation<PromotionPage, Error, PromotionPageMutationData>({
    async mutationFn(data) {
      const response = await apiClient(
        `/admin/promotion-pages/${promotionSectionId}`,
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
