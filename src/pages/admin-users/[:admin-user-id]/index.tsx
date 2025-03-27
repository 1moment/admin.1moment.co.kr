import * as React from "react";
import { useParams } from "react-router";
import { Heading } from "@/components/ui/heading.tsx";
import { useSuspenseQuery } from "@tanstack/react-query";
import { apiClient } from "@/utils/api-client.ts";

function AdminUser() {
  const params = useParams<{ "admin-user-id": string }>();

  const { data } = useSuspenseQuery<AdminUser>({
    queryKey: ["admin-users", params['admin-user-id']],
    queryFn: () => apiClient(`/admin/admin-users/${params['admin-user-id']}`).then((res) => res.json()),
  });

  return (
    <div>
      <Heading className="mb-8">{data.name}</Heading>
      fff
    </div>
  );
}

export default function Page() {
  return (
    <React.Fragment>
      <React.Suspense
        fallback={
          <div className="p-8 text-center">사용자정보를 불러오는 중...</div>
        }
      >
        <AdminUser />
      </React.Suspense>
    </React.Fragment>
  );
}
