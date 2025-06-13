import { useMutation, useSuspenseQuery } from "@tanstack/react-query";
import { apiClient } from "@/utils/api-client.ts";

export function useQuickTasks(options) {
  return useSuspenseQuery<{ items: Banner[] }>({
    queryKey: [
      "banners",
      { page: options.currentPage, status: options.status },
    ],
    async queryFn() {
      const params = new URLSearchParams();
      params.set("page", `${options.currentPage}`);
      params.set("limit",  "15");

      if (options.status) {
        params.set("status", options.status);
      }
      const response = await apiClient(
        `/admin/quick-tasks?${params.toString()}`,
      );
      const result = await response.json();
      return result;
    },
  });
}

export function useQuickTaskDeleteMutation() {
  return useMutation<undefined, Error, null>({
    mutationFn: async (quickTaskId) => {
      const response = await apiClient(`/admin/quick-tasks/${quickTaskId}`, {
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
