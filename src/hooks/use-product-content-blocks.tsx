import { useMutation, useSuspenseQuery } from "@tanstack/react-query";
import { apiClient } from "@/utils/api-client.ts";

export type ProductContentBlockMutationData = {
  title: string;
  content: string;
  isUsed: boolean;
};

export function useProductContentBlocks(options) {
  const data = {
    isUsed : options?.isUsed || false,
  };

  return useSuspenseQuery<{ items: ProductContentBlock[] }>({
    queryKey: ["product-content-blocks", JSON.stringify(data)],
    async queryFn() {
      const params = new URLSearchParams();
      params.set("isUsed", data.isUsed);
      const response = await apiClient(
        `/admin/product-content-blocks?${params.toString()}`,
      );
      const result = await response.json();
      return result;
    },
  });
}

export function useProductContentBlock(productContentBlockId: number) {
  return useSuspenseQuery<ProductContentBlock>({
    queryKey: ["product-content-blocks", productContentBlockId],
    queryFn: () =>
      apiClient(`/admin/product-content-blocks/${productContentBlockId}`).then(
        (res) => res.json(),
      ),
  });
}

export function useProductContentBlockCreateMutation() {
  return useMutation<
    ProductContentBlock,
    Error,
    ProductContentBlockMutationData
  >({
    mutationFn: async (data) => {
      const response = await apiClient("/admin/product-content-blocks", {
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

export function useProductContentBlockUpdateMutation(productContentBlockId: number) {
  return useMutation<
    ProductContentBlock,
    Error,
    ProductContentBlockMutationData
  >({
    mutationFn: async (data) => {
      const response = await apiClient(
        `/admin/product-content-blocks/${productContentBlockId}`,
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
