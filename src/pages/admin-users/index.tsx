import * as React from "react";
import * as Sentry from "@sentry/react";

import { Button } from "@/components/ui/button.tsx";
import { Heading } from "@/components/ui/heading.tsx";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table.tsx";
import { Switch } from "@/components/ui/switch.tsx";
import { Link } from "@/components/ui/link.tsx";

import {
  useAdminUsers,
  useAdminUsersSyncMutation,
} from "@/hooks/use-admin-users.tsx";

function AdminUserTable() {
  const { data, refetch } = useAdminUsers();
  const { mutate, isPending } = useAdminUsersSyncMutation();

  return (
    <React.Fragment>
      <div className="mb-8 flex items-start justify-between">
        <Heading>관리자</Heading>
        <Button
          isLoading={isPending}
          onClick={() => {
            mutate({
              onSuccess() {
                refetch();
                alert("동기화 성공");
              },
            });
          }}
        >
          동기화
        </Button>
      </div>
      <div className="mt-8 p-4 bg-white border border-gray-100 rounded-xl">
        <Table>
          <TableHead>
            <TableRow>
              <TableHeader>아이디</TableHeader>
              <TableHeader>이름</TableHeader>
              <TableHeader>권한</TableHeader>
              <TableHeader className="whitespace-nowrap w-1">
                활성화여부
              </TableHeader>
            </TableRow>
          </TableHead>
          <TableBody>
            {data?.map((user) => (
              <TableRow key={user.id}>
                <TableCell>
                  <Link className="underline" to={`/admin-users/${user.id}`}>
                    {user.username}
                  </Link>
                </TableCell>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.role}</TableCell>
                <TableCell>
                  <div className="flex justify-center">
                    <Switch checked={user.isActive} />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </React.Fragment>
  );
}

export default function AdminUserPage() {
  return (
    <React.Fragment>
      <Sentry.ErrorBoundary
        fallback={({ error, componentStack }) => {
          console.error(error, componentStack);
          return <p>{(error as Error).message}</p>;
        }}
      >
        <React.Suspense
          fallback={
            <div className="p-8 text-center">사용자 목록을 불러오는 중...</div>
          }
        >
          <AdminUserTable />
        </React.Suspense>
      </Sentry.ErrorBoundary>
    </React.Fragment>
  );
}
