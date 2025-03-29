import React from "react";
import * as Sentry from "@sentry/react";
import { apiClient } from "@/utils/api-client.ts";

import { useSearchParams, Link } from "react-router";
import { useSuspenseQuery } from "@tanstack/react-query";

import { Badge } from "@/components/ui/badge";
import { Dialog } from "@/components/ui/dialog.tsx";
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
import { generatePagination } from "@/utils/generate-pagination-array.ts";

function Products() {
  const [searchParams, setSearchParams] = useSearchParams();

  const currentPage = Number(searchParams.get("page") || 1);
  const {
    data: { items, meta },
  } = useSuspenseQuery<{ items: Product[] }>({
    queryKey: [
      "product",
      {
        page: currentPage,
        status: searchParams.get("status"),
      },
    ],
    async queryFn() {
      const params = new URLSearchParams(searchParams);
      params.set("page", `${currentPage}`);
      const response = await apiClient(`/admin/products?${params.toString()}`);
      const result = await response.json();
      return result;
    },
  });

  const [openImage, setOpenImage] = React.useState(null);
  return (
    <div>
      <Table>
        <TableHead>
          <TableRow>
            <TableHeader className="text-center whitespace-nowrap w-1">
              ID
            </TableHeader>
            <TableHeader>상품 정보</TableHeader>
            <TableHeader>이미지</TableHeader>
          </TableRow>
        </TableHead>
        <TableBody>
          {items?.map((product) => (
            <TableRow key={product.id}>
              <TableCell className="text-center">
                <Link className="underline" to={`/products/${product.id}`}>
                  {product.id}
                </Link>
              </TableCell>
              <TableCell>
                <Text>{product.slug}</Text>
                <Strong>{product.title}</Strong>
                <Text>{product.description}</Text>
              </TableCell>
              <TableCell>
                <img className="w-20 h-20" src={product.imageUrl} alt="" />
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

export default function ProductsPage() {
  return (
    <React.Fragment>
      <Heading className="mb-8">상품</Heading>
      <Sentry.ErrorBoundary fallback={(errorData) => <p>{errorData.error.message}</p>}>
        <React.Suspense
          fallback={
            <div className="p-8 text-center">상품 목록을 불러오는 중...</div>
          }
        >
          <Products />
        </React.Suspense>
      </Sentry.ErrorBoundary>
    </React.Fragment>
  );
}
