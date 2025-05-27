import { useMutation, useSuspenseQuery } from "@tanstack/react-query";
import { apiClient } from "@/utils/api-client.ts";

export function useOrders({
  currentPage = 1,
  limit = 20,
  status,
  startDate,
  endDate,
  deliveryMethodType,
  deliveryStatus,
  queryType,
  query,
  userId,
  deliveryDate,
}) {
  return useSuspenseQuery<{ items: Order[] }>({
    queryKey: [
      "orders",
      {
        page: currentPage,
        limit,
        status,
        startDate,
        endDate,
        deliveryMethodType,
        deliveryStatus,
        queryType,
        query,
        userId,
        deliveryDate,
      },
    ],
    async queryFn() {
      const params = new URLSearchParams();
      params.set("page", `${currentPage}`);
      params.set("limit", String(limit));
      if (startDate) params.set("startDate", startDate);
      if (endDate) params.set("endDate", endDate);
      if (deliveryMethodType)
        params.set("deliveryMethodType", deliveryMethodType);
      if (deliveryStatus) params.set("deliveryStatus", deliveryStatus);
      if (queryType) params.set("queryType", queryType);
      if (query) params.set("query", query);
      if (status) params.set("status", status);
      if (userId) params.set("userId", userId);
      if (deliveryDate) params.set("deliveryDate", deliveryDate);
      const response = await apiClient(`/admin/orders?${params.toString()}`);
      const result = await response.json();
      return result;
    },
  });
}

export function useOrder(orderId: number) {
  return useSuspenseQuery<Order>({
    queryKey: ["orders", orderId],
    async queryFn() {
      const response = await apiClient(`/admin/orders/${orderId}`);
      const result = await response.json();

      if (result.error) {
        throw new Error(result.message);
      }

      return result;
    },
  });
}

export function useOrderMessagePrint(orderId: number) {
  return useMutation({
    async mutationFn() {
      const response = await apiClient(`/admin/orders/${orderId}/printer`, {
        method: "POST",
      });
      const result = await response.json();
      return result;
    },
  });
}

export function useReserve(orderId: number) {
  return useMutation({
    async mutationFn(partner: string) {
      const response = await apiClient(
        `/reserve/${partner}?secret=f1d80654-3f7e-49e0-a43e-8678dbb47220`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            orderIds: [orderId],
          }),
        },
      );
      const result = await response.json();
      return result;
    },
  });
}

export function useOrderAssignment() {
  return useMutation<any, Error, { orderId: number; adminUserId: number }>({
    async mutationFn(data) {
      const { orderId } = data;
      const response = await apiClient(
        `/admin/orders/${orderId}/work-assignment`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            isAssigned: true,
          }),
        },
      );
      const result = await response.json();
      return result;
    },
  });
}

export function useOrderShipment(orderId: number) {
  return useMutation<any, Error, { imageUrl: number }>({
    async mutationFn(data) {
      const response = await apiClient(`/admin/orders/${orderId}/shipment`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          imageUrl: data.imageUrl,
        }),
      });
      const result = await response.json();
      return result;
    },
  });
}
