import { useMutation, useSuspenseQuery } from "@tanstack/react-query";
import { apiClient } from "@/utils/api-client.ts";

export function useDeliveryMethods(options) {
  return useSuspenseQuery<{ items: DeliveryMethod[] }>({
    queryKey: [
      "delivery-methods",
      { page: options.currentPage, status: options.status },
    ],
    async queryFn() {
      const params = new URLSearchParams();
      params.set("page", `${options.currentPage}`);
      params.set("limit", "15");

      if (options.status) {
        params.set("status", options.status);
      }
      const response = await apiClient(
        `/admin/delivery-methods?${params.toString()}`,
      );
      const result = await response.json();
      return result;
    },
  });
}

export function useDeliveryMethodUpdateMutation() {
  return useMutation<
    DeliveryMethod,
    Error,
    DeliveryMethod & { deliveryMethodId: number }
  >({
    mutationFn: async ({ deliveryMethodId, ...data }) => {
      const response = await apiClient(
        `/admin/delivery-methods/${deliveryMethodId}`,
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

export function useDeliveryMethodDeleteMutation() {
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
