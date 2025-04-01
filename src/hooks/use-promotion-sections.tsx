import { useSuspenseQuery } from "@tanstack/react-query";
import { apiClient } from "@/utils/api-client.ts";

export default function usePromotionSections({
  currentPage = 1,
  limit = 10,
  status,
}: { currentPage?: number; limit?: number; status: "PUBLISHED" | "DRAFT" }) {
  console.log('????', currentPage, limit, status)
  return useSuspenseQuery<{ items: PromotionSection[] }>({
    queryKey: [
      "promotion-sections",
      { status, page: currentPage, limit },
    ],
    async queryFn() {
      const params = new URLSearchParams();
      params.set("page", `${currentPage}`);
      params.set("limit", `${limit}`);
      if (status) params.set("status", status);

      const response = await apiClient(
        `/admin/promotion-sections?${params.toString()}`,
      );
      const result = await response.json();
      return result;
    },
  });
}
