import { useMutation, useSuspenseQuery } from "@tanstack/react-query";
import { apiClient } from "@/utils/api-client.ts";

export type BannerMutationData = Pick<
  Banner,
  | "title"
  | "status"
  | "imageUrl"
  | "mobileImageUrl"
  | "position"
  | "link"
  | "sequence"
>;
export function useBanners(options) {
  return useSuspenseQuery<{ items: Banner[] }>({
    queryKey: [
      "banners",
      { status: options.status, position: options.position },
    ],
    async queryFn() {
      const params = new URLSearchParams();
      params.set("status", options.status);
      params.set("limit", options.status === "PUBLISHED" ? "100" : "10");
      params.set("position", options.position);
      const response = await apiClient(`/admin/banners?${params.toString()}`);
      const result = await response.json();
      return result;
    },
  });
}

export function useBanner(bannerId: number) {
  return useSuspenseQuery<{ items: Banner[] }>({
    queryKey: ["banners", bannerId],
    async queryFn() {
      const response = await apiClient(`/admin/banners/${bannerId}`);
      const result = await response.json();
      return result;
    },
  });
}

export function useBannerCreateMutation() {
  return useMutation<Banner, Error, BannerMutationData>({
    async mutationFn(data) {
      const response = await apiClient("/admin/banners", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      const result = await response.json();
      if (result.error) {
        throw new Error(result.message);
      }
      return result;
    },
  });
}

export function useBannerUpdateMutation(bannerId: number) {
  return useMutation<Banner, Error, BannerMutationData>({
    async mutationFn(data) {
      const response = await apiClient(`/admin/banners/${bannerId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        throw new Error("Failed to update banner");
      }
      return await response.json();
    },
  });
}
