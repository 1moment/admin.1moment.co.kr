import {useMutation, useSuspenseQuery} from "@tanstack/react-query";
import { apiClient } from "@/utils/api-client.ts";
import {ProductMutationData} from "@/hooks/use-products.tsx";

export type CouponMutationData = Pick<
  Coupon,
  | "code"
  | "note"
  | "discountAmount"
  | "isDownloadable"
  | "isExpired"
  | "expirationDate"
>;

export function useCoupons(options) {
  const { currentPage = 1, queryType, query } = options || {};
  return useSuspenseQuery<{ items: Coupon[] }>({
    queryKey: ["coupons", { page: currentPage }],
    async queryFn() {
      const params = new URLSearchParams();
      params.set("page", `${currentPage}`);
      params.set("limit", "20");
      if (queryType) params.set("queryType", queryType);
      if (query) params.set("query", query);
      const response = await apiClient(`/admin/coupons?${params.toString()}`);
      const result = await response.json();
      return result;
    },
  });
}

export function useCoupon(couponId: number) {
  return useSuspenseQuery<Coupon>({
    queryKey: ["coupons", couponId],
    async queryFn() {
      const response = await apiClient(`/admin/coupons/${couponId}`);
      const result = await response.json();
      if (result.error) {
        throw new Error(result.message);
      }
      return result;
    },
  });
}

export function useUserCoupons({ currentPage, title, userId, couponId }) {
  return useSuspenseQuery<{ items: userCoupon[] }>({
    queryKey: ["user-coupons", { couponId }],
    queryFn() {
      const query = new URLSearchParams();
      query.set("size", "10");
      query.set("page", `${currentPage}`);
      if (title) query.set("title", `${title}`);
      if (couponId) query.set("couponId", `${couponId}`);
      if (userId) query.set("userId", `${userId}`);
      return apiClient(
          `/admin/user-coupons?${query.toString()}`,
      ).then((res) => res.json());
    },
  })
}

export function useCouponCreateMutation() {
  return useMutation<Coupon, Error | { statusCode: number; message: string; fieldErrors?: Record<string, string>}, ProductMutationData>({
    mutationFn: async (data) => {
      const response = await apiClient("/admin/coupons", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      if (!response.ok) {
        throw result;
      }

      return result;
    },
  });
}

export function useCouponUpdateMutation() {
  return useMutation<Coupon, Error | { statusCode: number; message: string; fieldErrors?: Record<string, string>}, ProductMutationData>({
    mutationFn: async (data) => {
      const response = await apiClient(`/admin/coupons/${data.couponId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      if (!response.ok) {
        throw result;
      }

      return result;
    },
  });
}

