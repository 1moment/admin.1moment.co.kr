import { useSuspenseQuery } from "@tanstack/react-query";
import { apiClient } from "@/utils/api-client.ts";

export function useUsers(params) {
  const { page = 1, query } = params || {};
  return useSuspenseQuery<{ items: UserCoupon[] }>({
    queryKey: ["users", { page, query }],
    async queryFn() {
      const params = new URLSearchParams();
      params.set("page", `${page}`);
      params.set("limit", "20");
      if (query) params.set("query", query);
      const response = await apiClient(`/admin/users?${params.toString()}`);
      const result = await response.json();
      return result;
    },
  });
}

export function useUser(userId: number) {
  return useSuspenseQuery<User>({
    queryKey: ["users", userId],
    async queryFn() {
      const response = await apiClient(`/admin/users/${userId}`);
      const result = await response.json();

      if (result.error) {
        throw new Error(result.message);
      }

      return result;
    },
  });
}
