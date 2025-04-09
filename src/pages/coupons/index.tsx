import * as React from "react";
import * as Sentry from "@sentry/react";
import { generatePagination } from "@/utils/generate-pagination-array.ts";
import { format } from "date-fns/format";
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
import { Strong, Text } from "@/components/ui/text.tsx";
import {
  Pagination,
  PaginationList,
  PaginationNext,
  PaginationPage,
  PaginationPrevious,
} from "@/components/ui/pagination.tsx";
import { Link } from "@/components/ui/link";

import { useCoupons } from "@/hooks/use-coupons.tsx";

function Coupons() {
  const [searchParams, setSearchParams] = useSearchParams();

  const currentPage = Number(searchParams.get("page") || 1);
  const {
    data: { items, meta },
  } = useCoupons({ currentPage });

  return (
    <div className="bg-white rounded-xl">
      <Table className="px-4">
        <TableHead>
          <TableRow>
            <TableHeader className="w-1 whitespace-nowrap text-center">
              식별자
            </TableHeader>
            <TableHeader>쿠폰명</TableHeader>
            <TableHeader className="w-1 whitespace-nowrap text-center">
              코드
            </TableHeader>
            <TableHeader>할인가격</TableHeader>
            <TableHeader className="w-1 whitespace-nowrap text-center">
              만료일
            </TableHeader>
            <TableHeader className="w-1 whitespace-nowrap text-center">
              생성일
            </TableHeader>
          </TableRow>
        </TableHead>
        <TableBody>
          {items?.map((coupon) => (
            <TableRow key={coupon.id}>
              <TableCell>
                <div className="flex justify-center">
                  <Link
                    className="underline tabular-nums"
                    to={`/coupons/${coupon.id}`}
                  >
                    {coupon.id}
                  </Link>
                </div>
              </TableCell>
              <TableCell>
                <Strong>{coupon.title}</Strong>
                <Text>{coupon.note}</Text>
              </TableCell>
              <TableCell>{coupon.code}</TableCell>
              <TableCell>
                {Number(coupon.discountAmount).toLocaleString("ko-KR")}
              </TableCell>
              <TableCell className="text-center tabular-nums">
                {coupon.expirationDate
                  ? format(
                      new Date(coupon.expirationDate),
                      "yyyy-MM-dd hh:mm:ss",
                    )
                  : "-"}
              </TableCell>
              <TableCell>
                {format(new Date(coupon.createdAt), "yyyy-MM-dd HH:mm:SS")}
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
              href={`?${new URLSearchParams({ ...searchParams, page }).toString()}`}
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

export default function CouponsPage() {
  return (
    <React.Fragment>
      <Heading className="mb-8">쿠폰</Heading>
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
          <Coupons />
        </React.Suspense>
      </Sentry.ErrorBoundary>
    </React.Fragment>
  );
}
