import { useMutation, useSuspenseQuery } from "@tanstack/react-query";
import { apiClient } from "@/utils/api-client.ts";

export type SnsSectionMutationData = Pick<
  SnsSection,
  "displayedHandlerName" | "imageUrl"
> &
  Partial<Pick<SnsSection, "sequence">> & {
    productId: number;
  };

export function useSnsSections({
  currentPage = 1,
  limit = 10,
  status,
}: { currentPage?: number; limit?: number; status: string }) {
  return useSuspenseQuery<{ items: SnsSection[] }>({
    queryKey: ["sns-sections", { status }],
    async queryFn() {
      const params = new URLSearchParams();
      params.set("page", `${currentPage}`);
      params.set("limit", status.published ? "100" : `${limit}`);
      if (status) params.set("status", status);

      const response = await apiClient(
        `/admin/sns-sections?${params.toString()}`,
      );
      const result = await response.json();
      return result;
    },
  });
}

export function useSnsSection(snsSectionId: number) {
  return useSuspenseQuery<SnsSection>({
    queryKey: ["sns-sections", snsSectionId],
    async queryFn() {
      const response = await apiClient(`/admin/sns-sections/${snsSectionId}`);
      const result = await response.json();
      return result;
    },
  });
}

export function useSnsSectionCreateMutation() {
  return useMutation<SnsSection, Error, SnsSectionMutationData>({
    async mutationFn(data) {
      const response = await apiClient("/admin/sns-sections", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
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

export function useSnsSectionUpdateMutation(snsSectionId: number) {
  return useMutation<SnsSection, Error, SnsSectionMutationData>({
    async mutationFn(data) {
      const result = await apiClient(`/admin/sns-sections/${snsSectionId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      return await result.json();
    },
  });
}
