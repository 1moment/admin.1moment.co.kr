import { useSuspenseQuery } from "@tanstack/react-query";
import { apiClient } from "@/utils/api-client.ts";

export function useDashboard() {
  return useSuspenseQuery<{
    newOrdersCount: number;
    preparingOrdersCount: number;
    shippedOrdersCount: number;
    cancelRequestedOrdersCount: number;
  }>({
    queryKey: ["dashboard", "summary"],
    async queryFn() {
      const response = await apiClient('/admin/dashboard');
      const result = await response.json();
      return result;
    },
  });
}

export function useDashboardOrderCount({ startDate, endDate }) {
  return useSuspenseQuery({
    queryKey: ["dashboard", 'order-count'],
    async queryFn() {
      const response = await apiClient(`/admin/dashboard/daily-order-count?startDate=${startDate}&endDate=${endDate}`);
      const result = await response.json();
      return result;
    },
  })
}

export function useDashboardOrderAmount({ startDate, endDate }) {
  return useSuspenseQuery({
    queryKey: ["dashboard", 'order-amount'],
    async queryFn() {
      const response = await apiClient(`/admin/dashboard/daily-order-amount?startDate=${startDate}&endDate=${endDate}`);
      const result = await response.json();
      return result;
    },
  })
}

