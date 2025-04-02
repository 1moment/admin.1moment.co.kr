import React from "react";
import * as Sentry from "@sentry/react";
import { generatePagination } from "@/utils/generate-pagination-array.ts";
import { useSearchParams, Link } from "react-router";

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
import { LinkButton } from "@/components/ui/button.tsx";

import { useProducts } from "@/hooks/use-products.tsx";

function Products() {
  const [searchParams, setSearchParams] = useSearchParams();

  const currentPage = Number(searchParams.get("page") || 1);
  const {
    data: { items, meta },
  } = useProducts({ currentPage });

  return (
    <div className="mt-8 p-4 bg-white border border-gray-100 rounded-xl">
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
      <div className="flex justify-between">
        <Heading>상품</Heading>
        <div>
          <LinkButton to="/products/create" color="zinc">
            상품 추가
          </LinkButton>
        </div>
      </div>
      <Sentry.ErrorBoundary
        fallback={(errorData) => <p>{errorData.error.message}</p>}
      >
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
