import React from "react";
import { generatePagination } from "@/utils/generate-pagination-array.ts";
import {  CornerDownRightIcon } from "lucide-react";
import {useSearchParams, Link } from "react-router";

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
import { Navbar, NavbarItem, NavbarSection } from "@/components/ui/navbar";
import { LinkButton } from "@/components/ui/button.tsx";

function ProductCategoriesPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  const currentPage = Number(searchParams.get("page") || 1);
  const status = searchParams.get("status") || "PUBLISHED";
  const {
    data: { items: categories, meta },
  } = useCategories({
    status,
    currentPage,
    limit: status === "PUBLISHED" ? 100 : 10,
  });

  const [openImage, setOpenImage] = React.useState(null);
  return (
    <div className="py-4 bg-white rounded-xl">
      <Navbar>
        <NavbarSection>
          <NavbarItem to="?status=PUBLISHED" current={status === "PUBLISHED"}>
            PUBLISHED
          </NavbarItem>
          <NavbarItem to="?status=DRAFT" current={status === "DRAFT"}>
            DRAFT
          </NavbarItem>
        </NavbarSection>
      </Navbar>
      <hr className="border-zinc-500/10" />
      <Table className="mt-4 px-4">
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
          {categories.map((category) => (
            <TableRow key={category.id}>
              <TableCell>
                <Link
                  className="underline"
                  to={`/product-categories/${category.id}`}
                >
                  {category.slug}
                </Link>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  {status === "PUBLISHED" && category.parentCategory && (
                    <CornerDownRightIcon className="w-[16px] h-[16px]" />
                  )}
                  {category.title}
                </div>
              </TableCell>
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
      {status !== "PUBLISHED" && (
        <Pagination className="mt-8">
          <PaginationPrevious>이전</PaginationPrevious>
          <PaginationList>
            {generatePagination(meta.totalPages, meta.page).map((page) => (
              <PaginationPage
                key={`page-${page}`}
                onClick={() => {
                  const params = new URLSearchParams(searchParams);
                  params.set("page", `${page}`);
                  setSearchParams(params);
                }}
                current={page === currentPage}
              >
                {page}
              </PaginationPage>
            ))}
          </PaginationList>
          <PaginationNext>다음</PaginationNext>
        </Pagination>
      )}
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
        <LinkButton to="/product-categories/create">추가</LinkButton>
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
