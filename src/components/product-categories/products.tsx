import * as React from "react";
import clsx from "clsx";
import { useSuspenseQuery } from "@tanstack/react-query";
import { apiClient } from "@/utils/api-client.ts";

import { generatePagination } from "@/utils/generate-pagination-array.ts";
import { Button } from "@/components/ui/button.tsx";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table.tsx";

export default function Products({ productCategoryId }) {
  const [currentPage, setCurrentPage] = React.useState(1);
  const {
    data: { items, meta },
  } = useSuspenseQuery<{ items: ProductCategory[] }>({
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
      query.set("size", "10");
      query.set("page", `${currentPage}`);
      return apiClient(`/admin/products?${query.toString()}`).then((res) =>
        res.json(),
      );
    },
  });

  return (
    <React.Fragment>
      <Table className="mt-8">
        <TableHead>
          <TableRow>
            <TableHeader>상품명</TableHeader>
          </TableRow>
        </TableHead>
        {items.length > 0 ? (
          <TableBody>
            {items.map((item) => (
              <TableRow key={`product-${item.id}`}>
                <TableCell>{item.title}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        ) : (
          <TableBody>
            <TableRow>
              <TableCell>연결된 상품이 없습니다.</TableCell>
            </TableRow>
          </TableBody>
        )}
      </Table>

      <ul className="mt-4 flex gap-3">
        <li className="grow basis-0">
          <Button
            plain
            disabled={currentPage < 2}
            onClick={() => setCurrentPage(currentPage - 1)}
          >
            <svg
              className="stroke-current"
              data-slot="icon"
              viewBox="0 0 16 16"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M2.75 8H13.25M2.75 8L5.25 5.5M2.75 8L5.25 10.5"
                strokeWidth={1.5}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            이전
          </Button>
        </li>
        {generatePagination(meta.totalPages, meta.page).map((page) => (
          <li key={`page-${page}`}>
            <Button
              plain
              className={clsx(
                "min-w-[2.25rem] before:absolute before:-inset-px before:rounded-lg",
                currentPage === page &&
                  "before:bg-zinc-950/5 dark:before:bg-white/10",
              )}
              onClick={() => setCurrentPage(page)}
            >
              {page}
            </Button>
          </li>
        ))}
        <li className="grow basis-0 flex justify-end">
          <Button
            plain
            disabled={currentPage >= meta.totalPages}
            onClick={() => setCurrentPage(currentPage + 1)}
          >
            다음
            <svg
              className="stroke-current"
              data-slot="icon"
              viewBox="0 0 16 16"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M13.25 8L2.75 8M13.25 8L10.75 10.5M13.25 8L10.75 5.5"
                strokeWidth={1.5}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </Button>
        </li>
      </ul>
    </React.Fragment>
  );
}
