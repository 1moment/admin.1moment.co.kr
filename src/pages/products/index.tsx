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
import { Button, LinkButton } from "@/components/ui/button.tsx";

import { useProducts } from "@/hooks/use-products.tsx";
import { Field, Label } from "@/components/ui/fieldset.tsx";
import { Select } from "@/components/ui/select.tsx";
import { Input } from "@/components/ui/input.tsx";

function Products() {
  const [searchParams, setSearchParams] = useSearchParams();

  const currentPage = Number(searchParams.get("page") || 1);
  const {
    data: { items, meta },
  } = useProducts({
    currentPage,
    query: searchParams.get("query"),
    queryType: searchParams.get("queryType"),
  });

  return (
    <div className="py-4 bg-white rounded-xl">
      <form className="mb-4 px-4 items-end flex">
        <div className="grow flex flex-col items-start justify-start gap-3">
          <div className="flex items-center justify-center gap-6">
            <Field className="shrink-0 w-16">
              <Label>검색어</Label>
            </Field>
            <Select
              className="max-w-48"
              name="queryType"
              defaultValue={searchParams.get("queryType") || "title"}
            >
              <option value="title">상품명</option>
            </Select>
            <Input
              className="max-w-80"
              name="query"
              placeholder="검색어"
              defaultValue={searchParams.get("query") as string}
            />
          </div>
        </div>
        <Button>조회</Button>
      </form>

      <hr className="border-gray-100" />

      <Table className="mt-4 px-4">
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
      <div className="mb-8 flex justify-between">
        <Heading>상품</Heading>
        <div>
          <LinkButton to="/products/create" color="zinc">
            상품 추가
          </LinkButton>
        </div>
      </div>
      <Sentry.ErrorBoundary
        fallback={({ error, componentStack }) => {
          console.error(error, componentStack);
          return <p>{(error as Error).message}</p>;
        }}
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
