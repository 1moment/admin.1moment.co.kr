import * as React from "react";
import * as Sentry from "@sentry/react";
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
import { Field, Fieldset, Label, Legend } from "@/components/ui/fieldset.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Button } from "@/components/ui/button.tsx";
import { useUsers } from "@/hooks/use-users.tsx";

function UserCoupons() {
  const [searchParams, setSearchParams] = useSearchParams();

  const currentPage = Number(searchParams.get("page") || 1);
  const query = searchParams.get("query");
  const {
    data: { items, meta },
  } = useUsers({ page: currentPage, query });

  return (
    <React.Fragment>
      <form className="mb-8 p-4 items-end flex bg-white sm:rounded-xl">
        <Fieldset className="grow flex flex-col items-start justify-start gap-3">
          <Legend>검색조건</Legend>
          <div className="flex items-center justify-center gap-6">
            <Field className="shrink-0 w-16">
              <Label>검색어</Label>
            </Field>
            <Input
              className="max-w-80"
              name="query"
              placeholder="검색어"
              defaultValue={searchParams.get("query") as string}
            />
          </div>
        </Fieldset>
        <Button type="submit">조회</Button>
      </form>
      <div className="bg-white rounded-xl">
        <Table className="mt-3 px-4">
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
                등급
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
                <TableCell className="text-center">{user.level}</TableCell>
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

        <Pagination className="p-4">
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
    </React.Fragment>
  );
}

export default function UserCouponsPage() {
  return (
    <React.Fragment>
      <Heading className="mb-8">사용자</Heading>
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
          <UserCoupons />
        </React.Suspense>
      </Sentry.ErrorBoundary>
    </React.Fragment>
  );
}
