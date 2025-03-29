import React from "react";
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

function ProductCategoriesPage() {
  const [searchParams] = useSearchParams();
  const { data: categories } = useSuspenseQuery<ProductCategory[]>({
    queryKey: ["product-categories", { status: searchParams.get("status") }],
    queryFn: () =>
      apiClient("/admin/product-categories").then((res) => res.json()),
  });

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
      <Dialog open={!!openImage} onClose={() => setOpenImage(null)}>
        <img src={openImage} alt="" />
      </Dialog>
    </div>
  );
}

export default function Page() {
  return (
    <React.Fragment>
      <Heading className="mb-8">상품 카테고리</Heading>
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
