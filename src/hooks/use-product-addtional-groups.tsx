import { useMutation, useSuspenseQuery } from "@tanstack/react-query";
import { apiClient } from "@/utils/api-client.ts";

type ProductAdditionalGroupMutationData = Pick<ProductAdditionalGroup, "title"> & {
  productIds: number[];
};
export function useProductAdditionalGroups() {
  return useSuspenseQuery<{ items: ProductAdditionalGroup[] }>({
    queryKey: ["product-additional-groups"],
    async queryFn() {
      const response = await apiClient("/admin/product-additional-groups");
      return await response.json();
    },
  });
}

export function useProductAdditionalGroup(productAdditionalGroupId: number) {
  return useSuspenseQuery<ProductAdditionalGroup>({
    queryKey: ["product-additional-groups", productAdditionalGroupId],
    async queryFn() {
      const response = await apiClient(
        `/admin/product-additional-groups/${productAdditionalGroupId}`,
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

export function useProductAdditionalGroupCreateMutation() {
  return useMutation<ProductAdditionalGroup, Error, ProductAdditionalGroupMutationData>({
    mutationFn: async (data) => {
      const response = await apiClient("/admin/product-additional-groups", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      if (!response.ok) {
        throw result;
      }

      return result;
    },
  });
}

export function useProductAdditionalGroupUpdateMutation(
  productAdditionalGroupId: number,
) {
  return useMutation<ProductAdditionalGroup, Error, ProductAdditionalGroupMutationData>({
    mutationFn: async (data) => {
      const response = await apiClient(
        `/admin/product-additional-groups/${productAdditionalGroupId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        },
      );

      const result = await response.json();
      if (!response.ok) {
        throw result;
      }

      return result;
    },
  });
}
