import { useMutation, useSuspenseQuery } from "@tanstack/react-query";
import { apiClient } from "@/utils/api-client.ts";

export type AdminUserMutationData = Pick<AdminUser, "name" | "role" | "username" | "isActive">;

export function useAdminUsers() {
  return useSuspenseQuery<AdminUser[]>({
    queryKey: ["admin-users"],
    async queryFn() {
      const response = await apiClient("/admin/admin-users");
      const result = await response.json();
      return result;
    },
  });
}

export function useAdminUser(adminUserId: number) {
  return useSuspenseQuery<AdminUser>({
    queryKey: ["admin-users", adminUserId],
    async queryFn() {
      const response = await apiClient(`/admin/admin-users/${adminUserId}`);
      const result = await response.json();
      return result;
    },
  });
}

export function useAdminUserCreateMutation() {
  return useMutation<AdminUser, Error, MutationData>({
    async mutationFn(data) {
      const response = await apiClient("/admin/admin-users", {
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

export function useAdminUserUpdateMutation(adminUserId: number) {
  return useMutation<
    AdminUser,
    Error,
    Pick<
      Partial<MutationData & { password: string }>,
      "name" | "username" | "role" | "password" | "isActive"
    >
  >({
    async mutationFn(data) {
      const response = await apiClient(`/admin/admin-users/${adminUserId}`, {
        method: "PATCH",
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
