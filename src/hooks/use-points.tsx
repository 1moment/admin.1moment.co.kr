import { useMutation, useSuspenseQuery } from "@tanstack/react-query";
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
      params.set("limit", limit || "10");

      if (userId) {
        params.set("userId", userId);
      }

      const response = await apiClient(`/admin/points?${params.toString()}`);
      const result = await response.json();
      return result;
    },
  });
}

export function usePayPoint() {
  return useMutation<
    any,
    Error,
    { amount: number; note?: string; userId: number }
  >({
    async mutationFn(data) {
      const { amount, note, userId } = data;
      const response = await apiClient("/admin/points", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount,
          note,
          userId,
        }),
      });
      const result = await response.json();
      if (result.error) {
        throw new Error(result.message);
      }

      return result;
    },
  });
}
