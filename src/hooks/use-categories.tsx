import { useMutation, useSuspenseQuery } from "@tanstack/react-query";
import { apiClient } from "@/utils/api-client.ts";

type MutationData = Pick<
  ProductCategory,
  "title" | "slug" | "status" | "imageUrl" | "mobileImageUrl"
> & {
  parentId?: ProductCategory["parentId"];
  seq?: ProductCategory["seq"];
};
export function useCategories(option?: {
  limit?: number;
  status: "PUBLISHED" | "DRAFT";
  currentPage?: number;
}) {
  const limit = option?.limit || 10;
  const currentPage = option?.currentPage || 1;
  return useSuspenseQuery<{ items: ProductCategory[] }>({
    queryKey: ["product-categories", { limit, status: option?.status }],
    async queryFn() {
      const params = new URLSearchParams();
      params.set("limit", limit.toString());
      params.set("page", currentPage.toString());
      if (option?.status) params.set("status", option.status);
      const response = await apiClient(
        `/admin/product-categories?${params.toString()}`,
      );
      return await response.json();
    },
  });
}

export function useCategory(categoryId: number) {
  return useSuspenseQuery<ProductCategory>({
    queryKey: ["product-categories", categoryId],
    async queryFn() {
      const response = await apiClient(
        `/admin/product-categories/${categoryId}`,
      );

      if (response.status !== 200) {
        throw new Error("알 수 없는 오류가 발생했습니다");
      }
      const result = await response.json();
      if (result.error) {
        throw new Error("알 수 없는 오류가 발생했습니다");
      }
      return result;
    },
    retry: false,
  });
}

export function useCategoryCreateMutation() {
  return useMutation<ProductCategory, Error, MutationData>({
    mutationFn: async (data) => {
      const response = await apiClient("/admin/product-categories", {
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

export function useCategoryUpdateMutation(categoryId: number) {
  return useMutation<
    ProductCategory,
    Error,
    Pick<
      Partial<MutationData>,
      "title" | "slug" | "status" | "imageUrl" | "mobileImageUrl" | "seq"
    > & {
      parentId?: ProductCategory["parentId"];
    }
  >({
    mutationFn: async (data) => {
      const response = await apiClient(
        `/admin/product-categories/${categoryId}`,
        {
          method: "PATCH",
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
