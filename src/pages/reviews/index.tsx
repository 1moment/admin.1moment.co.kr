import * as React from "react";
import { format } from "date-fns/format";
import { useSuspenseQuery } from "@tanstack/react-query";
import { apiClient } from "@/utils/api-client.ts";
import { useSearchParams } from "react-router";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table.tsx";
import { Heading } from "@/components/ui/heading.tsx";
import {
  Pagination,
  PaginationList,
  PaginationNext,
  PaginationPrevious,
  PaginationPage,
} from "@/components/ui/pagination.tsx";
import { Strong, Text } from "@/components/ui/text";
import { Rating } from "@/components/ui/rating.tsx";
import { generatePagination } from "@/utils/generate-pagination-array.ts";
import { Button } from "@/components/ui/button.tsx";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import {Link} from "@/components/ui/link.tsx";

function ReviewsPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  const currentPage = Number(searchParams.get("page") || 1);
  const {
    data: { items, meta },
  } = useSuspenseQuery<{ items: Review[] }>({
    queryKey: [
      "reviews",
      {
        page: currentPage,
        rating: searchParams.get("rating"),
      },
    ],
    queryFn: () => {
      return apiClient(
        `/admin/reviews?${searchParams.toString()}&size=20`,
      ).then((res) => res.json());
    },
  });

  return (
    <div>
      <Table className="max-w-[100%]">
        <TableHead>
          <TableRow>
            <TableHeader className="w-auto">내용</TableHeader>
            <TableHeader>작성일</TableHeader>
            <TableHeader>별점</TableHeader>
            <TableHeader>숨김여부</TableHeader>
            <TableHeader>주문번호</TableHeader>
          </TableRow>
        </TableHead>
        <TableBody>
          {items.map((review) => (
            <TableRow key={review.id}>
              <TableCell>
                {review.title && <Strong>{review.title}</Strong>}
                <Text className="whitespace-pre-wrap">
                  {review.description}
                </Text>
                {review.images?.length > 0 && (
                  <ul className="mt-3 flex gap-1">
                    {review.images.map((image) => (
                      <img
                        key={`review-${review.id}-${image.id}`}
                        className="w-24 h-24 rounded border border-gray-50"
                        src={image.imageUrl}
                        alt=""
                      />
                    ))}
                  </ul>
                )}
                {review.product && (
                  <div className="mt-3 border-l-4 px-3 py-2 border-gray-200">
                    <Strong>{review.product.title}</Strong>
                  </div>
                )}
              </TableCell>
              <TableCell>
                {format(new Date(review.createdAt), "yyyy-MM-dd HH:mm:ss")}
              </TableCell>
              <TableCell>
                <Rating rating={review.ratingScore} />
              </TableCell>
              <TableCell>
                {review.isHidden ? (
                  <Button plain>
                    <EyeOffIcon />
                  </Button>
                ) : (
                  <Button plain>
                    <EyeIcon />
                  </Button>
                )}
              </TableCell>
              <TableCell>
                <Link className="underline" to={`/orders/${review.orderItem.order.id}`}>{review.orderItem.order.id}</Link></TableCell>
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
              href={`?${new URLSearchParams({ ...searchParams, page }).toString()}`}
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

export default function Page() {
  return (
    <React.Fragment>
      <React.Suspense
        fallback={
          <div className="p-8 text-center">리뷰목록을 불러오는 중...</div>
        }
      >
        <Heading>리뷰목록</Heading>
        <ReviewsPage />
      </React.Suspense>
    </React.Fragment>
  );
}
