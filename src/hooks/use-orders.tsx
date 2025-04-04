import { useSuspenseQuery } from "@tanstack/react-query";
import { apiClient } from "@/utils/api-client.ts";

export function useOrders({
  currentPage = 1,
  status,
  startDate,
  endDate,
  deliveryMethodType,
  deliveryStatus,
  queryType,
  query,
}) {
  return useSuspenseQuery<{ items: Order[] }>({
    queryKey: [
      "orders",
      {
        page: currentPage,
        status,
        startDate,
        endDate,
        deliveryMethodType,
        deliveryStatus,
        queryType,
        query,
      },
    ],
    async queryFn() {
      const params = new URLSearchParams();
      params.set("page", `${currentPage}`);
      params.set("limit", "20");
      if (startDate) params.set("startDate", startDate);
      if (endDate) params.set("endDate", endDate);
      if (deliveryMethodType)
        params.set("deliveryMethodType", deliveryMethodType);
      if (deliveryStatus) params.set("deliveryStatus", deliveryStatus);
      if (queryType) params.set("queryType", queryType);
      if (query) params.set("query", query);
      if (status) params.set("status", status);
      const response = await apiClient(`/admin/orders?${params.toString()}`);
      const result = await response.json();
      return result;
    },
  });
  6;
}
