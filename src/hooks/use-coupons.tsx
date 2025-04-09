import { useSuspenseQuery } from "@tanstack/react-query";
import { apiClient } from "@/utils/api-client.ts";

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
  const { currentPage = 1 } = options || {};
  return useSuspenseQuery<{ items: Coupon[] }>({
    queryKey: ["coupons", { page: currentPage }],
    async queryFn() {
      const params = new URLSearchParams();
      params.set("page", `${currentPage}`);
      params.set("limit", "20");
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
