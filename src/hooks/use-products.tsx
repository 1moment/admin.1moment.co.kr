import { apiClient } from "@/utils/api-client.ts";

import { useMutation, useSuspenseQuery } from "@tanstack/react-query";

export type ProductMutationData = Pick<
  Product,
  "title" | "slug" | "status" | "imageUrl" | "content" | "items"
> &
  Partial<Pick<Product, "description">> & {
    categoryIds: number[];
    topContentBlockId: number | null;
    bottomContentBlockId: number | null;
  };

export function useProducts({
  currentPage = 1,
  limit = 10,
  queryType,
  query,
}: {
  currentPage?: number;
  limit?: number;
  queryType?: string;
  query?: string;
}) {
  return useSuspenseQuery<{ items: Product[] }>({
    queryKey: ["products", { page: currentPage, limit }],
    async queryFn() {
      const params = new URLSearchParams();
      params.set("page", `${currentPage}`);
      params.set("limit", `${limit}`);
      if (queryType) params.set("queryType", queryType);
      if (query) params.set("query", query);

      const response = await apiClient(`/admin/products?${params.toString()}`);
      const result = await response.json();
      return result;
    },
  });
}

export function useProduct(productId: number) {
  return useSuspenseQuery<Product>({
    queryKey: ["products", productId],
    async queryFn() {
      const response = await apiClient(`/admin/products/${productId}`);
      const result = await response.json();
      return result;
    },
  });
}

export function useProductCreateMutation() {
  return useMutation<Product, Error, ProductMutationData>({
    mutationFn: async (data) => {
      const response = await apiClient("/admin/products", {
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

export function useProductUpdateMutation(productId: number) {
  return useMutation<ProductCategory, Error, ProductMutationData>({
    mutationFn: async (data) => {
      const response = await apiClient(`/admin/products/${productId}`, {
        method: "PUT",
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

export function useProductDeleteMutation(productId: number) {
  return useMutation<undefined, Error, null>({
    mutationFn: async () => {
      const response = await apiClient(`/admin/products/${productId}`, {
        method: "DELETE",
      });

      if (response.status === 204) {
        return;
      }

      const result = await response.json();
      throw new Error(result.message);
    },
  });
}
