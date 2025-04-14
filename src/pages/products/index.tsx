import React from "react";
import * as Sentry from "@sentry/react";
import { generatePagination } from "@/utils/generate-pagination-array.ts";
import {useSearchParams, Link, useNavigate} from "react-router";

import * as Headless from "@headlessui/react";
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
import { Field, Fieldset, Label, Legend } from "@/components/ui/fieldset.tsx";
import { Select } from "@/components/ui/select.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Checkbox } from "@/components/ui/checkbox.tsx";
import { Navbar, NavbarItem, NavbarSection } from "@/components/ui/navbar.tsx";
import { createSearchParamsFromExisting } from "@/utils/query-prams-helper.ts";

function Products() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const currentPage = Number(searchParams.get("page") || 1);
  const status = searchParams.get("status");
  const {
    data: { items, meta },
  } = useProducts({
    currentPage,
    query: searchParams.get("query"),
    queryType: searchParams.get("queryType"),
    isAdditional: searchParams.get("isAdditional") === "on",
  });

  return (
    <React.Fragment>
      <form className="mb-8 p-4 items-end flex bg-white sm:rounded-xl">
        <Fieldset className="grow flex flex-col items-start justify-start gap-3">
          <Legend>검색조건</Legend>
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

          <div className="flex items-center justify-center gap-6">
            <Headless.Field className="shrink-0 flex items-center gap-6">
              <Label>추가전용상품</Label>
              <Checkbox
                name="isAdditional"
                defaultChecked={searchParams.get("isAdditional") === "on"}
                className="mt-0"
              />
            </Headless.Field>
          </div>
        </Fieldset>
        <Button type="submit">조회</Button>
      </form>

      <div className="bg-white rounded-xl">
        <Navbar className="px-4">
          <NavbarSection>
            <NavbarItem
              to="?"
              current={status !== "PUBLISHED" && status !== "DRAFT"}
            >
              ALL
            </NavbarItem>
            <NavbarItem
              to={createSearchParamsFromExisting(
                searchParams,
                ["query", "queryType", "isAdditional"],
                { status: "PUBLISHED" },
              )}
              current={status === "PUBLISHED"}
            >
              PUBLISHED
            </NavbarItem>
            <NavbarItem
              to={createSearchParamsFromExisting(
                searchParams,
                ["query", "queryType", "isAdditional"],
                { status: "DRAFT" },
              )}
              current={status === "DRAFT"}
            >
              DRAFT
            </NavbarItem>
          </NavbarSection>
        </Navbar>
        <hr className="border-gray-100" />

        <Table className="mt-4 px-4">
          <TableHead>
            <TableRow>
              <TableHeader className="text-center">이미지</TableHeader>
              <TableHeader>상품명</TableHeader>
              <TableHeader>상품 정보</TableHeader>
              <TableHeader>옵션</TableHeader>
            </TableRow>
          </TableHead>
          <TableBody>
            {items?.map((product) => (
              <TableRow
                  key={product.id}
                  className="cursor-pointer"
                  tabIndex={0}
                  onClick={() => {
                    navigate(`/products/${product.id}`);
                  }}
              >
                <TableCell>
                  <img className="w-20 h-20" src={product.imageUrl} alt="" />
                </TableCell>
                <TableCell>
                  {product.title}
                </TableCell>
                <TableCell>
                  <Text>{product.slug}</Text>
                  <Text>{product.description}</Text>
                </TableCell>
                <TableCell>
                  {Array.isArray(product.items) && product.items.length > 0 && (
                    <ul>
                      {product.items.map((item) => (
                        <li key={`item-${item.id}`}>{item.title}&nbsp;(재고: {item.quantityInStock}개)</li>
                      ))}
                    </ul>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <Pagination className="mt-8 p-4">
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
