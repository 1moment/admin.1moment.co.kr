import React from "react";

import { useSearchParams, Link } from "react-router";

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

import { useCategories } from "@/hooks/use-categories.tsx";
import {
  Pagination,
  PaginationList,
  PaginationNext,
  PaginationPage,
  PaginationPrevious,
} from "@/components/ui/pagination.tsx";
import { generatePagination } from "@/utils/generate-pagination-array.ts";
import { Button } from "@/components/ui/button.tsx";

function ProductCategoriesPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  const currentPage = Number(searchParams.get("page") || 1);
  const {
    data: { items: categories, meta },
  } = useCategories({ status: searchParams.get("status"), currentPage });

  const [openImage, setOpenImage] = React.useState(null);
  return (
    <div>
      <Table>
        <TableHead>
          <TableRow>
            <TableHeader className="whitespace-nowrap w-1">SLUG</TableHeader>
            <TableHeader>카테고리명</TableHeader>
            <TableHeader className="whitespace-nowrap w-1">
              PC 이미지
            </TableHeader>
            <TableHeader className="whitespace-nowrap w-1">
              모바일 이미지
            </TableHeader>
            <TableHeader className="text-center whitespace-nowrap w-1">
              상태
            </TableHeader>
            <TableHeader className="whitespace-nowrap w-1">순서</TableHeader>
          </TableRow>
        </TableHead>
        <TableBody>
          {categories?.map((category) => (
            <TableRow key={category.id}>
              <TableCell>
                <Link
                  className="underline"
                  to={`/product-categories/${category.id}`}
                >
                  {category.slug}
                </Link>
              </TableCell>
              <TableCell>{category.title}</TableCell>
              <TableCell>
                <img
                  className="w-auto min-h-10"
                  src={category.imageUrl}
                  alt=""
                  onClick={() => setOpenImage(category.imageUrl)}
                />
              </TableCell>
              <TableCell>
                <img
                  src={category.mobileImageUrl}
                  alt=""
                  onClick={() => setOpenImage(category.mobileImageUrl)}
                />
              </TableCell>
              <TableCell>
                <div className="flex justify-center">
                  <Badge
                    color={category.status === "DRAFT" ? "yellow" : "cyan"}
                  >
                    {category.status}
                  </Badge>
                </div>
              </TableCell>
              <TableCell>{category.seq}</TableCell>
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
      <Dialog open={!!openImage} onClose={() => setOpenImage(null)}>
        <img src={openImage} alt="" />
      </Dialog>
    </div>
  );
}

export default function Page() {
  return (
    <React.Fragment>
      <div className="mb-8 flex items-start justify-between">
        <Heading>상품 카테고리</Heading>
        <Button to="/product-categories/create">추가</Button>
      </div>
      <React.Suspense
        fallback={
          <div className="p-8 text-center">
            상품 카테고리 목록을 불러오는 중...
          </div>
        }
      >
        <ProductCategoriesPage />
      </React.Suspense>
    </React.Fragment>
  );
}
