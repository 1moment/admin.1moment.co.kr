import * as React from "react";
import * as Sentry from "@sentry/react";
import { format } from "date-fns/format";
import { generatePagination } from "@/utils/generate-pagination-array.ts";
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
import { Button } from "@/components/ui/button.tsx";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { Link } from "@/components/ui/link.tsx";

import {
  useReviews,
  useReviewVisibilityMutation,
} from "@/hooks/use-reviews.tsx";
import { Field, Label } from "@/components/ui/fieldset.tsx";
import { Select } from "@/components/ui/select.tsx";

function ReviewsPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  const currentPage = Number(searchParams.get("page") || 1);
  const rating = Number(searchParams.get("rating"));
  const isHidden = searchParams.get("isHidden");

  const {
    data: { items, meta },
    refetch,
  } = useReviews({ currentPage, rating, isHidden });

  const { mutate: updateVisibility } = useReviewVisibilityMutation();

  return (
    <div className="mt-10 py-4 bg-white sm:rounded-xl">
      <form className="px-4 items-end flex">
        <div className="grow flex flex-col items-start justify-start gap-3">
          <div className="flex items-center justify-center gap-6">
            <Field className="shrink-0 w-16">
              <Label>별점</Label>
            </Field>
            <Select className="max-w-48" name="rating" defaultValue={rating}>
              <option value="">전체</option>
              <option value="5">⭐️⭐️⭐️⭐️⭐️</option>
              <option value="4">⭐️⭐️⭐️⭐️</option>
              <option value="3">⭐️⭐️⭐️</option>
              <option value="2">⭐️⭐️</option>
              <option value="1">⭐️</option>
            </Select>
          </div>

          <div className="flex items-center justify-center gap-6">
            <Field className="shrink-0 w-16">
              <Label>숨김여부</Label>
            </Field>
            <Select
                className="max-w-48"
                name="isHidden"
                defaultValue={isHidden}
            >
              <option value="">전체</option>
              <option value="true">숨김</option>
              <option value="false">표시</option>
            </Select>
          </div>
        </div>
        <Button type="submit" className="shrink-0" color="zinc">
          조회
        </Button>
      </form>
      <hr className="mt-4 border-zinc-500/10" />
      <Table className="mt-4 px-4 max-w-[100%]">
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
                    <EyeOffIcon
                      onClick={() => {
                        if (confirm("리뷰를 숨기겠습니까?")) {
                          updateVisibility(
                            {
                              reviewId: review.id,
                              isHidden: false,
                            },
                            {
                              onSuccess() {
                                refetch();
                              },
                            },
                          );
                        }
                      }}
                    />
                  </Button>
                ) : (
                  <Button plain>
                    <EyeIcon
                      onClick={() => {
                        if (confirm("리뷰를 숨기겠습니까?")) {
                          updateVisibility(
                            {
                              reviewId: review.id,
                              isHidden: true,
                            },
                            {
                              onSuccess() {
                                refetch();
                              },
                            },
                          );
                        }
                      }}
                    />
                  </Button>
                )}
              </TableCell>
              <TableCell>
                {review.orderItem?.order && (
                  <Link
                    className="underline"
                    to={`/orders/${review.orderItem.order.id}`}
                  >
                    {review.orderItem.order.id}
                  </Link>
                )}
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
                setSearchParams((prev) => {
                  const params = new URLSearchParams(prev);
                  params.set("page", `${page}`);
                  return params;
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

export default function Page() {
  return (
    <React.Fragment>
      <Sentry.ErrorBoundary
        fallback={({ error, componentStack }) => {
          console.error(error, componentStack);
          return <p>{(error as Error).message}</p>;
        }}
      >
        <React.Suspense
          fallback={
            <div className="p-8 text-center">리뷰목록을 불러오는 중...</div>
          }
        >
          <Heading>리뷰목록</Heading>
          <ReviewsPage />
        </React.Suspense>
      </Sentry.ErrorBoundary>
    </React.Fragment>
  );
}
