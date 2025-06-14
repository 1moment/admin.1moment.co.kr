import { useSuspenseQuery } from "@tanstack/react-query";
import { apiClient } from "@/utils/api-client.ts";


export function usePoints(options) {
  const { currentPage = 1, limit, userId } = options || {};
  return useSuspenseQuery<{ items: Point[] }>({
    queryKey: [
      "points",
      {
        page: currentPage,
      },
    ],
    async queryFn() {
      const params = new URLSearchParams();
      params.set("page", `${currentPage}`);
      params.set("limit", limit || '10');

      if (userId) {
        params.set("userId", userId);
      }

      const response = await apiClient(
        `/admin/points?${params.toString()}`,
      );
      const result = await response.json();
      return result;
    },
  });
}
