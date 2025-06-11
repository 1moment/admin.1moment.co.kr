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
import { useUserCoupons } from "@/hooks/use-coupons.tsx";
import { Fieldset, Legend } from "@/components/ui/fieldset.tsx";
import { Select } from "@/components/ui/select.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Button } from "@/components/ui/button.tsx";

function UserCoupons() {
  const [searchParams, setSearchParams] = useSearchParams();

  const currentPage = Number(searchParams.get("page") || 1);
  const queryType = searchParams.get("queryType");
  const query = searchParams.get("query");

  const condition = { currentPage };
  if (queryType === "title") {
    condition.title = query;
  }
  if (queryType === "userId") {
    condition.userId = Number(query);
  }
  if (queryType === "couponId") {
    condition.couponId = Number(query);
  }
  const {
    data: { items, meta },
  } = useUserCoupons(condition);

  return (
    <React.Fragment>
      <form className="mb-8 p-4 items-end flex bg-white sm:rounded-xl">
        <Fieldset className="grow flex flex-col items-start justify-start gap-3">
          <Legend>검색조건</Legend>
          <div className="flex items-center justify-center gap-6">
            <Select
              className="max-w-48"
              name="queryType"
              defaultValue={searchParams.get("queryType") || "title"}
            >
              <option value="title">쿠폰명</option>
              <option value="userId">유저ID</option>
              <option value="couponId">쿠폰ID</option>
            </Select>
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
                유저ID
              </TableHeader>
              <TableHeader className="w-1 whitespace-nowrap text-center">
                쿠폰ID
              </TableHeader>
              <TableHeader>쿠폰명</TableHeader>
              <TableHeader className="w-1 whitespace-nowrap text-center">
                사용
              </TableHeader>
              <TableHeader className="w-1 whitespace-nowrap text-center">
                만료일
              </TableHeader>
              <TableHeader className="w-1 whitespace-nowrap text-center">
                발급일자
              </TableHeader>
            </TableRow>
          </TableHead>
          <TableBody>
            {items?.map((userCoupon) => (
              <TableRow key={userCoupon.id}>
                <TableCell className="text-center tabular-nums">
                  {userCoupon.id}
                </TableCell>
                <TableCell>
                  <div className="flex justify-center">
                    <Link
                      className="underline tabular-nums"
                      to={`/users/${userCoupon.user.id}`}
                    >
                      {userCoupon.user.id}
                    </Link>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex justify-center">
                    <Link
                      className="underline tabular-nums"
                      to={`/coupons/${userCoupon.coupon.id}`}
                    >
                      {userCoupon.coupon.id}
                    </Link>
                  </div>
                </TableCell>
                <TableCell>{userCoupon.coupon.title}</TableCell>
                <TableCell className="text-center tabular-nums">
                  {userCoupon.order && (
                    <Link to={`/orders/${userCoupon.order.id}`}>
                      {userCoupon.order.id}
                    </Link>
                  )}
                  {userCoupon.usedAt
                    ? format(new Date(userCoupon.usedAt), "yyyy-MM-dd HH:mm:ss")
                    : "-"}
                </TableCell>
                <TableCell className="text-center tabular-nums">
                  {userCoupon.coupon.expirationDate
                    ? format(
                        new Date(userCoupon.coupon.expirationDate),
                        "yyyy-MM-dd HH:mm:ss",
                      )
                    : "-"}
                </TableCell>
                <TableCell className="text-center tabular-nums">
                  {format(
                    new Date(userCoupon.createdAt),
                    "yyyy-MM-dd HH:mm:ss",
                  )}
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
      <Heading className="mb-8">쿠폰 발급 현황</Heading>
      <Sentry.ErrorBoundary
        fallback={({ error, componentStack }) => {
          console.error(error, componentStack);
          return <p>{(error as Error).message}</p>;
        }}
      >
        <React.Suspense
          fallback={
            <div className="p-8 text-center">쿠폰 목록을 불러오는 중...</div>
          }
        >
          <UserCoupons />
        </React.Suspense>
      </Sentry.ErrorBoundary>
    </React.Fragment>
  );
}
