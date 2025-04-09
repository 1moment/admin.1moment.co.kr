import { useMutation, useSuspenseQuery } from "@tanstack/react-query";
import { apiClient } from "@/utils/api-client.ts";

export type PromotionCategoryMutationData = Pick<
  PromotionCategory & { categoryId: number },
  "title" | "imageUrl" | "seq" | "categoryId"
>;

export function usePromotionCategories(options) {
  const { currentPage = 1 } = options || {};

  return useSuspenseQuery<{ items: PromotionCategory[] }>({
    queryKey: ["promotion-categories", { page: currentPage }],
    async queryFn() {
      const params = new URLSearchParams();
      params.set("page", `${currentPage}`);
      const response = await apiClient(
        `/admin/promotion-categories?${params.toString()}`,
      );
      const result = await response.json();
      return result;
    },
  });
}

export function usePromotionCategory(promotionCategoryId: number) {
  return useSuspenseQuery<PromotionCategory>({
    queryKey: ["promotion-categories", promotionCategoryId],
    async queryFn() {
      const response = await apiClient(
        `/admin/promotion-categories/${promotionCategoryId}`,
      );
      const result = await response.json();

      return result;
    },
  });
}

export function usePromotionCategoryCreateMutation() {
  return useMutation<PromotionCategory, Error, PromotionCategoryMutationData>({
    async mutationFn(data) {
      const response = await apiClient("/admin/promotion-categories", {
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

export function usePromotionCategoryUpdateMutation(
  promotionCategoryId: number,
) {
  return useMutation<PromotionCategory, Error, PromotionCategoryMutationData>({
    async mutationFn(data) {
      const response = await apiClient(
        `/admin/promotion-categories/${promotionCategoryId}`,
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
