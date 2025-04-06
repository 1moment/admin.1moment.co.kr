import * as React from "react";
import { apiClient } from "@/utils/api-client.ts";
import { format } from "date-fns/format";
import * as Sentry from "@sentry/react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router";

import { Heading } from "@/components/ui/heading.tsx";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table.tsx";
import { Link } from "@/components/ui/link";

function PromotionCategories() {
  const [searchParams] = useSearchParams();

  const currentPage = Number(searchParams.get("page") || 1);
  const {
    data: { items },
  } = useSuspenseQuery<{ items: PromotionCategory[] }>({
    queryKey: ["promotion-categories", { page: currentPage }],
    async queryFn() {
      const params = new URLSearchParams();
      params.set("page", `${currentPage}`);
      const response = await apiClient(
        `/admin/promotion-categories?${params.toString()}`,
      );
      const result = await response.json();
      return result;
    },
  });

  return (
    <div className="py-4 bg-white rounded-xl">
      <Table>
        <TableHead>
          <TableRow>
            <TableHeader className="w-1 whitespace-nowrap text-center">
              식별자
            </TableHeader>
            <TableHeader className="w-1 whitespace-nowrap text-center">
              연결된 카테고리
            </TableHeader>
            <TableHeader className="w-1 whitespace-nowrap text-center">이미지</TableHeader>
            <TableHeader>타이틀</TableHeader>
            <TableHeader className="w-1 whitespace-nowrap text-center">
              순서
            </TableHeader>
            <TableHeader className="w-1 whitespace-nowrap text-center">
              이미지
            </TableHeader>
            <TableHeader className="w-1 whitespace-nowrap text-center">
              생성일
            </TableHeader>
            <TableHeader className="w-1 whitespace-nowrap text-center">
              수정일
            </TableHeader>
          </TableRow>
        </TableHead>
        <TableBody>
          {items?.map((promotionCategory) => (
            <TableRow key={promotionCategory.id}>
              <TableCell className="text-center tabular-nums">
                <Link
                  className="underline tabular-nums"
                  to={`/promotion-categories/${promotionCategory.id}`}
                >
                  {promotionCategory.id}
                </Link>
              </TableCell>
              <TableCell>
                <div className="flex justify-center">
                  <Link
                    className="underline tabular-nums"
                    to={`/product-categories/${promotionCategory.category.id}`}
                  >
                    {promotionCategory.category.title}
                  </Link>
                </div>
              </TableCell>
              <TableCell className="text-center">
                <img className="w-10 h-10" src={promotionCategory.imageUrl} alt="" />
              </TableCell>
              <TableCell>{promotionCategory.title}</TableCell>
              <TableCell className="text-center">
                {promotionCategory.seq}
              </TableCell>
              <TableCell className="text-center tabular-nums">
                {format(
                  new Date(promotionCategory.createdAt),
                  "yyyy-MM-dd HH:mm:ss",
                )}
              </TableCell>
              <TableCell className="text-center tabular-nums">
                {format(
                    new Date(promotionCategory.updatedAt),
                    "yyyy-MM-dd HH:mm:ss",
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

export default function PromotionCategoriesPage() {
  return (
    <React.Fragment>
      <Heading className="mb-8">맞춤형 추천상품 섹션</Heading>
      <Sentry.ErrorBoundary
        fallback={(errorData) => <p>{errorData.error.message}</p>}
      >
        <React.Suspense
          fallback={
            <div className="p-8 text-center">목록을 불러오는 중...</div>
          }
        >
          <PromotionCategories />
        </React.Suspense>
      </Sentry.ErrorBoundary>
    </React.Fragment>
  );
}
