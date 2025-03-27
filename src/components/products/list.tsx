import * as React from "react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { apiClient } from "@/utils/api-client.ts";

import {
  Pagination,
  PaginationList,
  PaginationNext,
  PaginationPage,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { generatePagination } from "@/utils/generate-pagination-array.ts";
import { useSearchParams } from "react-router";

export default function ProductsList({
  pageKey = "page",
  productCategoryId,
  size,
}) {
  const [searchParams] = useSearchParams();

  const currentPage = Number(searchParams.get(pageKey) || 1);
  const {
    data: { items, meta },
  } = useSuspenseQuery<ProductCategory>({
    queryKey: [
      "products",
      {
        productCategory: productCategoryId,
        page: currentPage,
      },
    ],
    queryFn() {
      const query = new URLSearchParams();
      if (productCategoryId) query.set("category", productCategoryId);
      if (size) query.set("size", size);
      if (searchParams.get(pageKey)) query.set("page", currentPage);
      return apiClient(`/admin/products?${query.toString()}`).then((res) =>
        res.json(),
      );
    },
  });

  return (
    <div>
      <Pagination>
        <PaginationPrevious
          href={
            currentPage > 1
              ? `?${new URLSearchParams({ ...searchParams, [pageKey]: currentPage - 1 }).toString()}`
              : undefined
          }
        >
          이전
        </PaginationPrevious>
        <PaginationList>
          {generatePagination(meta.totalPages, meta.page).map((page) => (
            <PaginationPage
              key={`${pageKey}-${page}`}
              href={`?${new URLSearchParams({ ...searchParams, [pageKey]: page }).toString()}`}
              current={page === currentPage}
            >
              {page}
            </PaginationPage>
          ))}
        </PaginationList>
        <PaginationNext
          href={
            currentPage < meta.totalPages
              ? `?${new URLSearchParams({ ...searchParams, [pageKey]: currentPage + 1 }).toString()}`
              : undefined
          }
        >
          다음
        </PaginationNext>
      </Pagination>
    </div>
  );
}
