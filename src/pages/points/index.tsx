import * as React from "react";
import { apiClient } from "@/utils/api-client.ts";
import { useSearchParams } from "react-router";
import { useSuspenseQuery } from "@tanstack/react-query";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table.tsx";
import { Heading } from "@/components/ui/heading.tsx";
import {
  Pagination,
  PaginationList,
  PaginationNext,
  PaginationPage,
  PaginationPrevious,
} from "@/components/ui/pagination.tsx";
import { generatePagination } from "@/utils/generate-pagination-array.ts";
import { format } from "date-fns/format";
import { Link } from "@/components/ui/link.tsx";

function Point() {
  const [searchParams, setSearchParams] = useSearchParams();

  const currentPage = Number(searchParams.get("page") || 1);
  const {
    data: { items, meta },
  } = useSuspenseQuery<{ items: Point[] }>({
    queryKey: [
      "points",
      {
        page: currentPage,
      },
    ],
    async queryFn() {
      const params = new URLSearchParams();
      params.set("page", `${currentPage}`);
      params.set("size", "20");

      const response = await apiClient(
        `/admin/points?${searchParams.toString()}`,
      );
      const result = await response.json();
      return result;
    },
  });

  return (
    <div className="py-4 bg-white rounded-xl">
      <Table className="px-4">
        <TableHead>
          <TableRow>
            <TableHeader className="w-1 whitespace-nowrap text-center">
              식별자
            </TableHeader>
            <TableHeader>내용</TableHeader>
            <TableHeader className="text-center">금액</TableHeader>
            <TableHeader className="text-center">사용자</TableHeader>
            <TableHeader className="text-center">적립일자</TableHeader>
          </TableRow>
        </TableHead>
        <TableBody>
          {items.map((point) => (
            <TableRow key={point.id}>
              <TableCell className="text-center">{point.id}</TableCell>

              <TableCell>{point.note}</TableCell>

              <TableCell className="text-center">
                {point.amount.toLocaleString("ko-KR")}
              </TableCell>
              <TableCell className="text-center">
                <Link className="underline" to={`/users/${point.user.id}`}>
                  {point.user.id}
                </Link>
              </TableCell>
              <TableCell className="text-center">
                {format(new Date(point.createdAt), "yyyy-MM-dd HH:mm:ss")}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Pagination className="px-4 mt-8">
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

export default function PointsPage() {
  return (
    <React.Fragment>
      <div className="mb-8 flex items-start justify-between">
        <Heading>적립금 내역</Heading>
      </div>
      <React.Suspense
        fallback={
          <div className="p-8 text-center">적립금내역을 불러오는 중...</div>
        }
      >
        <Point />
      </React.Suspense>
    </React.Fragment>
  );
}
