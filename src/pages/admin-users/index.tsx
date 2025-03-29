import * as React from "react";
import { apiClient } from "@/utils/api-client.ts";

import { useSuspenseQuery } from "@tanstack/react-query";

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
import CreateDialog from "@/components/admin-users/create-dialog.tsx";
import { Link } from "@/components/ui/link.tsx";

interface AdminUser {
  id: number;
  username: string;
  name: string;
  role: string;
}

export default function AdminUserPage() {
  return (
    <React.Fragment>
      <Heading className="mb-8">관리자</Heading>
      <React.Suspense
        fallback={
          <div className="p-8 text-center">사용자 목록을 불러오는 중...</div>
        }
      >
        <AdminUserTable />
      </React.Suspense>
    </React.Fragment>
  );
}

function AdminUserTable() {
  const { data } = useSuspenseQuery<AdminUser[]>({
    queryKey: ["admin-users"],
    queryFn: () => apiClient("/admin/admin-users").then((res) => res.json()),
  });

  const [isCreateDialogOpen, setIsCreateDialogOpen] = React.useState(false);

  return (
    <div className="">
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
                <Link className="underline" to={`/admin-users/${user.id}`}>{user.username}</Link>
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
      <div className="mt-6 flex justify-end">
        <Button onClick={() => setIsCreateDialogOpen(true)}>관리자 추가</Button>
      </div>
      <CreateDialog
        isOpen={isCreateDialogOpen}
        setIsOpen={setIsCreateDialogOpen}
      />
    </div>
  );
}
