import * as React from "react";
import { apiClient } from "@/utils/api-client.ts";
import { generatePagination } from "@/utils/generate-pagination-array.ts";
import { format } from "date-fns/format";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router";

import { Heading } from "@/components/ui/heading.tsx";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table.tsx";
import {
  Pagination,
  PaginationList,
  PaginationNext,
  PaginationPage,
  PaginationPrevious,
} from "@/components/ui/pagination.tsx";
import { Link } from "@/components/ui/link";

function UserCoupons() {
  const [searchParams, setSearchParams] = useSearchParams();

  const currentPage = Number(searchParams.get("page") || 1);
  const {
    data: { items, meta },
  } = useSuspenseQuery<{ items: UserCoupon[] }>({
    queryKey: ["users", { page: currentPage }],
    async queryFn() {
      const params = new URLSearchParams();
      params.set("page", `${currentPage}`);
      const response = await apiClient(`/admin/users?${params.toString()}`);
      const result = await response.json();
      return result;
    },
  });

  return (
    <div>
      <Table>
        <TableHead>
          <TableRow>
            <TableHeader className="w-1 whitespace-nowrap text-center">
              식별자
            </TableHeader>
            <TableHeader className="w-1 whitespace-nowrap text-center">
              이메일
            </TableHeader>
            <TableHeader className="w-1 whitespace-nowrap text-center">
              이름
            </TableHeader>
            <TableHeader className="w-1 whitespace-nowrap text-center">
              연락처
            </TableHeader>
            <TableHeader className="w-1 whitespace-nowrap text-center">
              가입방법
            </TableHeader>
            <TableHeader className="w-1 whitespace-nowrap text-center">
              가입일
            </TableHeader>
            <TableHeader className="w-1 whitespace-nowrap text-center">
              마지막 로그인 일자
            </TableHeader>
          </TableRow>
        </TableHead>
        <TableBody>
          {items?.map((user) => (
            <TableRow key={user.id}>
              <TableCell>
                <div className="flex justify-center">
                  <Link
                    className="underline tabular-nums"
                    to={`/users/${user.id}`}
                  >
                    {user.id}
                  </Link>
                </div>
              </TableCell>
              <TableCell className="text-center">{user.email}</TableCell>
              <TableCell className="text-center">{user.name}</TableCell>

              <TableCell className="text-center tabular-nums">
                {user.phoneNumber}
              </TableCell>
              <TableCell className="text-center">
                {user.authProvider}
              </TableCell>

              <TableCell className="text-center tabular-nums">
                {format(new Date(user.createdAt), "yyyy-MM-dd HH:mm:ss")}
              </TableCell>

              <TableCell className="text-center tabular-nums">
                {format(new Date(user.lastLoginAt), "yyyy-MM-dd HH:mm:ss")}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Pagination className="mt-8">
        <PaginationPrevious>이전</PaginationPrevious>
        <PaginationList>
          {generatePagination(meta.totalPages, meta.page).map((page) => (
            <PaginationPage
              key={`page-${page}`}
              onClick={() => {
                setSearchParams((searchParams) => {
                  searchParams.set("page", `${page}`);
                  return searchParams;
                });
              }}
              current={page === currentPage}
            >
              {page}
            </PaginationPage>
          ))}
        </PaginationList>
        <PaginationNext>다음</PaginationNext>
      </Pagination>
    </div>
  );
}

export default function UserCouponsPage() {
  return (
    <React.Fragment>
      <Heading className="mb-8">쿠폰</Heading>
      <React.Suspense
        fallback={
          <div className="p-8 text-center">쿠폰 목록을 불러오는 중...</div>
        }
      >
        <UserCoupons />
      </React.Suspense>
    </React.Fragment>
  );
}
