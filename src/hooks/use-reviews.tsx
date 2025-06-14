import { useMutation, useSuspenseQuery } from "@tanstack/react-query";
import { apiClient } from "@/utils/api-client.ts";

export function useReviews(options) {
  const data = {
    page: options.currentPage || 1,
    rating: options.rating || null,
    isHidden: options.isHidden || null,
    userId: options.userId || null,
  };

  return useSuspenseQuery<{ items: Review[] }>({
    queryKey: ["reviews", JSON.stringify(data)],
    async queryFn() {
      const params = new URLSearchParams();
      params.set("page", `${data.page}`);
      if (data.rating) params.set("rating", data.rating);
      if (typeof data.isHidden === "string")
        params.set("isHidden", data.isHidden);
      if (data.userId) {
        params.set("userId", data.userId);
      }
      const response = await apiClient(`/admin/reviews?${params.toString()}`);
      const result = await response.json();
      return result;
    },
  });
}

export function useReviewVisibilityMutation() {
  return useMutation<Review, Error, { reviewId: number; isHidden: boolean }>({
    async mutationFn(data) {
      const response = await apiClient(
        `/admin/reviews/${data.reviewId}/visibility`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ isHidden: data.isHidden }),
        },
      );
      const result = await response.json();
      return result;
    },
  });
}
