import { apiClient } from "@/utils/api-client.ts";

import { useSuspenseQuery } from "@tanstack/react-query";

export default function useProducts({
  currentPage = 1,
  limit = 10,
}: { currentPage?: number; limit?: number }) {
  return useSuspenseQuery<{ items: Product[] }>({
    queryKey: ["products", { page: currentPage, limit }],
    async queryFn() {
      const params = new URLSearchParams();
      params.set("page", `${currentPage}`);
      params.set("limit", `${limit}`);

      const response = await apiClient(`/admin/products?${params.toString()}`);
      const result = await response.json();
      return result;
    },
  });
}
