import { useSuspenseQuery } from "@tanstack/react-query";
import { apiClient } from "@/utils/api-client.ts";

export default function useCategories({
  limit = 10,
  status,
}: { limit?: number; status: "PUBLISHED" | "DRAFT" }) {
  return useSuspenseQuery<{ items: ProductCategory[] }>({
    queryKey: ["product-categories", { limit, status }],
    async queryFn() {
      const params = new URLSearchParams();
      params.set("limit", limit.toString());
      if (status) params.set("status", status);
      const response = await apiClient(
        `/admin/product-categories?${params.toString()}`,
      );
      return await response.json();
    },
  });
}
