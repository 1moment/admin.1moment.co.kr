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
import { Strong, Text } from "@/components/ui/text.tsx";
import {
  Pagination,
  PaginationList,
  PaginationNext,
  PaginationPage,
  PaginationPrevious,
} from "@/components/ui/pagination.tsx";
import { Link } from "@/components/ui/link";

function Coupons() {
  const [searchParams, setSearchParams] = useSearchParams();

  const currentPage = Number(searchParams.get("page") || 1);
  const {
    data: { items, meta },
  } = useSuspenseQuery<{ items: Coupon[] }>({
    queryKey: ["coupons", { page: currentPage }],
    queryFn: () => {
      return apiClient(`/admin/coupons?${searchParams.toString()}`).then(
        (res) => res.json(),
      );
    },
  });

  return (
    <div className="p-4 border border-gray-100 rounded">
      <Table>
        <TableHead>
          <TableRow>
            <TableHeader>ID</TableHeader>
            <TableHeader>쿠폰명</TableHeader>
            <TableHeader>코드</TableHeader>
            <TableHeader>할인가격</TableHeader>
            <TableHeader>만료일</TableHeader>
            <TableHeader>생성일</TableHeader>
          </TableRow>
        </TableHead>
        <TableBody>
          {items?.map((coupon) => (
            <TableRow key={coupon.id}>
              <TableCell>
                <Link className="underline" to={`/coupons/${coupon.id}`}>{coupon.id}</Link>
              </TableCell>
              <TableCell>
                <Strong>{coupon.title}</Strong>
                <Text>{coupon.note}</Text>
              </TableCell>
              <TableCell>{coupon.code}</TableCell>
              <TableCell>
                {Number(coupon.discountAmount).toLocaleString("ko-KR")}
              </TableCell>
              <TableCell>
                {format(new Date(coupon.expirationDate), "yyyy-MM-dd hh:mm:ss")}
              </TableCell>
              <TableCell>
                {format(new Date(coupon.createdAt), "yyyy-MM-dd HH:mm:SS")}
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
      <React.Suspense
        fallback={
          <div className="p-8 text-center">쿠폰 목록을 불러오는 중...</div>
        }
      >
        <Coupons />
      </React.Suspense>
    </React.Fragment>
  );
}
